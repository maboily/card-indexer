Cards = new Mongo.Collection('cards');

Card = Astro.Class({
    name: 'Card',
    collection: Cards,

    fields: {
        cardSet: 'object',
        name: 'string',
        number: 'number',
        scanUrl: {
            type: 'string',
            optional: true
        },
        scanUrlOriginal: {
            type: 'string',
            optional: true
        },
        scanUrlRH: {
            type: 'string',
            optional: true
        },
        scanUrlRHOriginal: {
            type: 'string',
            optional: true
        },
        status: {
            type: 'string',
            default: 'Synchronized'
        },
        userId: {
            type: 'string',
            immutable: true
        },
        value: {
            type: 'number',
            optional: true
        },
        hasReverseHolo: {
            type: 'boolean',
            optional: true
        },
        valueReverseHolo: {
            type: 'number',
            optional: true
        }
    },

    validators: {
        name: [Validators.required(), Validators.string()],
        number: [Validators.required(), Validators.number()],
        cardSet: [Validators.required(), Validators.object()]
    },

    events: {
        afterInsert: (e) => {
            if (Meteor.isServer) {
                var card = e.target;

                // Increases reverse holo/normal cards count in set
                let toIncrement = {};
                toIncrement.normalCardsInSet = 1;
                if (card.hasReverseHolo) toIncrement.rhCardsInSet = 1;

                CardSet.update({ _id: card.cardSet._id }, { $inc: toIncrement });
            }
        },

        afterUpdate: (e) => {
            if (Meteor.isServer) {
                var oldCard = e.target._original,
                    card = e.target;

                // Updates card last visited entry
                CardLastVisited.update({
                    'card._id': card._id
                }, {
                    $set: {
                        card: CardLastVisitedHelper.minimize.card(card)
                    }
                }, {
                    multi: true
                });

                // Update card collection entry
                CardCollectionEntry.update({
                    'card._id': card._id
                }, {
                    $set: {
                        card: CardCollectionEntryHelper.minimize.card(card)
                    }
                }, {
                    multi: true
                });

                if (oldCard.hasReverseHolo != card.hasReverseHolo) {
                    // Increment/decrement stats in card set
                    incrementValue = card.hasReverseHolo ? 1 : -1;

                    CardSet.update({ _id: card.cardSet._id }, { $inc: { rhCardsInSet: incrementValue }});
                }
            }
        },

        afterRemove: (e) => {
            if (Meteor.isServer) {
                var card = e.target;

                // Removes card last visited entry
                CardLastVisited.remove({
                    'card._id': card._id
                }, {
                    multi: true
                });

                // Removes card from collections
                CardCollectionEntry.remove({
                    'card._id': card._id
                }, {
                    multi: true
                });

                // Decrement card stats in card set
                // Increases reverse holo/normal cards count in set
                let toIncrement = {};
                toIncrement.normalCardsInSet = -1;
                if (card.hasReverseHolo) toIncrement.rhCardsInSet = -1;

                CardSet.update({ _id: card.cardSet._id }, { $inc: toIncrement });
            }
        }
    }
});

CardHelper = {
    minimize: {
        cardSet: (cardSet) => {
            return {
                _id: cardSet._id,
                name: cardSet.name,
                numberCount: cardSet.numberCount
            }
        }
    },

    listLimit: 20,

    makeFiltersFromOptions(options) {
        let filters = {};

        if (options.filters.setId) filters['cardSet._id'] = options.filters.setId;
        if (options.filters.status) filters['status'] = options.filters.status;
        if (options.filters.search) filters['name'] = {
            $regex: `.*${options.filters.search}.*`
        };
        if (options.filters.onlyIds) filters['_id'] = {
            $in: options.filters.onlyIds
        };
        if (options.filters.exceptIds) filters['_id'] = {
            $nin: options.filters.exceptIds
        };

        return filters;
    },

    makeSortsFromOptions(options) {
        let sorts = {};

        if (!options.sorts) { // Default sort
            sorts['cardSet.name'] = 1;
            sorts['number'] = 1;
        } else { // Custom sort
            for (var sortName in options.sorts) {
                sorts[sortName] = options.sorts[sortName];
            }
        }

        return sorts;
    }
};

Meteor.methods({
    addCard: function(data) {
        Auth.requireAdmin();

        // Finds corresponding card set
        var cardSet = CardSet.findOne({
            _id: data.cardSet._id
        });

        var card = new Card(data);
        card.set('userId', Meteor.userId());
        card.set('cardSet', CardHelper.minimize.cardSet(cardSet));

        if (card.validate()) {
            return card.save();
        } else {
            card.throwValidationException();
        }
    },

    updateCard: function(cardId, data) {
        Auth.requireAdmin();

        var card = Card.findOne({
            _id: cardId
        });
        card.set(data);

        // Changed set?
        if (card.cardSet) {
            // Finds corresponding card set
            var cardSet = CardSet.findOne({
                _id: card.cardSet._id
            });

            card.set('cardSet', CardHelper.minimize.cardSet(cardSet));
        }

        // Updates last visited entry associated with card
        if (card.validate()) {
            return card.save();
        } else {
            card.throwValidationException();
        }
    },

    synchronizeCard: function(cardId) {
        Auth.requireAdmin();

        // Updates corresponding card status to synchronizing
        Card.update({
            _id: cardId
        }, {
            $set: {
                status: 'Synchronizing'
            }
        });
    },

    synchronizeAllCards: function() {
        Auth.requireAdmin();

        // Sets ALL cards status to synchronizing
        Card.update({}, {
            $set: {
                status: 'Synchronizing'
            }
        }, {
            multi: true
        });
    },

    removeCard: function(cardId) {
        Auth.requireAdmin();

        Card.remove({
            _id: cardId
        });
    }
});
