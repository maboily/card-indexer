Meteor.publish('cardsLastVisited', function() {
    Auth.requireLoggedIn.bind(this);

    return CardLastVisited.find({
        userId: this.userId
    }, {
        sort: {
            createdAt: -1
        },
        limit: 10
    });
});
