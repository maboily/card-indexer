Meteor.publish('cardsCollectionEntries', function(userId) {
    Auth.requireLoggedIn.bind(this);

    userId = userId ? userId : this.userId;

    return CardsCollectionEntries.find({
        'user._id': userId
    });
});

Meteor.publish('cardsCollectionOwnedIds', function() {
    Auth.requireLoggedIn.bind(this);

    return CardsCollectionEntries.find({
        'user._id': this.userId
    });
});
