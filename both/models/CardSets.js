CardSets = new Meteor.Collection('card_sets');

CardSet = Astro.Class({
    name: 'CardSet',
    collection: CardSets,
    fields: {
        name: 'string',
        numberCount: 'number',
        userId: 'string',
        normalCardsInSet: {
            type: 'number',
            default: 0
        },
        rhCardsInSet: {
            type: 'number',
            default: 0
        }
    },

    validators: {
        name: [Validators.required(), Validators.string()],
        numberCount: [Validators.required(), Validators.number()]
    },

    events: {
        afterUpdate: (e) => {
            if (Meteor.isServer) {
                var cardSet = e.target;

                // Updates cards related to card set
                Card.update({
                    'cardSet._id': cardSet._id
                }, {
                    $set: {
                        cardSet: CardHelper.minimize.cardSet(cardSet)
                    }
                }, {
                    multi: true
                });

                // Updates cards last visited
                CardLastVisited.update({
                    'card.cardSet._id': cardSet._id
                }, {
                    $set: {
                        'card.cardSet': CardHelper.minimize.cardSet(cardSet)
                    }
                }, {
                    multi: true
                });
            }
        }
    }
});

Meteor.methods({
    addCardSet: function(data) {
        Auth.requireAdmin();

        var cardSet = new CardSet(data);
        cardSet.set('userId', Meteor.userId());

        if (cardSet.validate()) {
            return cardSet.save();
        } else {
            cardSet.throwValidationException();
        }
    },

    updateCardSet: function(setId, data) {
        Auth.requireAdmin();

        var cardSet = CardSet.findOne({
            _id: setId
        });
        cardSet.set(data);

        if (cardSet.validate()) {
            return cardSet.save();
        } else {
            cardSet.throwValidationException();
        }
    },

    removeCardSet: function(setId) {
        Auth.requireAdmin();

        CardSet.remove({
            _id: setId
        });
    },

    synchronizeSet: function(setId) {
        Auth.requireAdmin();

        if (Meteor.isServer) {
            Card.update({
                'cardSet._id': setId
            }, {
                $set: {
                    status: 'Synchronizing'
                }
            }, {
                multi: true
            });
        }
    },

    findApparentSet: function(card) {
        Auth.requireAdmin();

        var cardSetFound = CardSet.findOne({
            numberCount: parseInt(card.setCardsCount)
        });

        card.cardSetId = cardSetFound ? cardSetFound._id : null;
        return card;
    }
});
