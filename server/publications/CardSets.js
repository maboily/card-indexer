Meteor.publish('cardSets', function() {
    Auth.requireLoggedIn.bind(this);

    return CardSet.find({}, {
        sort: {
            name: 1
        }
    });
});

Meteor.publish('cardSet', function(setId) {
    Auth.requireLoggedIn.bind(this);

    return CardSet.find({ _id: setId });
});
