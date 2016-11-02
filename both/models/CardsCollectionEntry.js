CardsCollectionEntries = new Mongo.Collection('cards_collection_entries');

CardCollectionEntry = Astro.Class({
    name: 'CardCollectionEntry',
    collection: CardsCollectionEntries,

    fields: {
        amountOwnedNormal: 'number',
        amountOwnedRH: 'number',
        card: 'object',
        user: 'object'
    },

    validators: {
        amountOwnedNormal: [Validators.required(), Validators.number()],
        amountOwnedRH: [Validators.required(), Validators.number()],
        card: [Validators.required(), Validators.object()],
        cardSet: [Validators.required(), Validators.object()]
    },
});

CardCollectionEntryHelper = {
    minimize: {
        card: (card) => {
            return {
                _id: card._id,
                number: card.number,
                name: card.name,
                value: card.value,
                valueReverseHolo: card.valueReverseHolo,
                scanUrl: card.scanUrl,
                scanUrlRH: card.scanUrlRH,
                cardSet: card.cardSet,
                hasReverseHolo: card.hasReverseHolo
            };
        },

        user: (user) => {
            return {
                _id: user._id,
                name: user.name
            }
        }
    }
};

Meteor.methods({
    setCollectionEntry: function(cardId, amountOwnedNormal, amountOwnedRH) {
        Auth.requireLoggedIn();

        // Finds card collection entry in database
        var cardCollectionEntry = CardCollectionEntry.findOne({
            'card._id': cardId
        });
        if (cardCollectionEntry) {
            if (amountOwnedNormal > 0 || amountOwnedRH > 0) {
                // Updates info
                cardCollectionEntry.set('amountOwnedNormal', !isNaN(amountOwnedNormal) ? amountOwnedNormal : 0);
                cardCollectionEntry.set('amountOwnedRH', !isNaN(amountOwnedRH) ? amountOwnedRH : 0);
                cardCollectionEntry.save();
            } else {
                // Removes card collection entry
                cardCollectionEntry.remove();
            }
        } else {
            // Finds matching meteor user
            var user = Meteor.user();

            // Finds matching card
            var card = Card.findOne({
                _id: cardId
            });

            // Creates new card collection entry
            cardCollectionEntry = new CardCollectionEntry({
                amountOwnedNormal: !isNaN(amountOwnedNormal) ? amountOwnedNormal : 0,
                amountOwnedRH: !isNaN(amountOwnedRH) ? amountOwnedRH : 0,
                card: CardCollectionEntryHelper.minimize.card(card),
                user: CardCollectionEntryHelper.minimize.user(user)
            });
            cardCollectionEntry.save();
        }
    }
});
