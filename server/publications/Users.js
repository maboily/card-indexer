Meteor.publish('userProfile', function() {
    Auth.requireLoggedIn.bind(this);

    return Meteor.users.find({
        _id: this.userId
    }, {
        fields: {
            group: 1
        }
    });
});
