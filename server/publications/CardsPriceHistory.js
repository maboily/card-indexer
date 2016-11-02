Meteor.publish('cardsPriceHistory', function(cardId) {
    Auth.requireLoggedIn.bind(this);

    return CardsPriceHistory.find({
        cardId: cardId
    }, {
        sort: {
            createdAt: -1
        }
    });
});
