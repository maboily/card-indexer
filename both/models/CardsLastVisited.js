CardsLastVisited = new Mongo.Collection('cards_last_visited');

CardLastVisited = Astro.Class({
    name: 'CardLastVisited',
    collection: CardsLastVisited,

    fields: {
        card: 'object',
        createdAt: {
            type: 'date',
            immutable: true
        },
        userId: 'string'
    }
});

CardLastVisitedHelper = {
    minimize: {
        card: (card) => {
            return {
                _id: card._id,
                number: card.number,
                name: card.name,
                cardSet: card.cardSet
            }
        }
    }
};

Meteor.methods({
    setLastVisited: function(cardId) {
        Auth.requireLoggedIn();

        // Remove last visited entry
        var userId = Meteor.userId();
        CardsLastVisited.remove({
            userId: userId,
            'card._id': cardId
        });

        // Finds card in database
        var card = Card.findOne({
            _id: cardId
        });
        if (card) {
            // Inserts last visited entry
            CardLastVisited.insert({
                createdAt: new Date(),
                userId: userId,
                card: CardLastVisitedHelper.minimize.card(card)
            });
        }
    }
});
