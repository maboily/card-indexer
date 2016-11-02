Auth = {
    isLoggedIn() {
            try {
                return this.userId ? true : Meteor.userId();
            } catch (ex) {
                return false;
            }
        },

        isAdmin() {
            return Auth.isLoggedIn() && Meteor.user() && Meteor.user().group == "admin";
        },

        requireLoggedIn() {
            if (!Auth.isLoggedIn.bind(this)()) {
                throw new Meteor.Error("not-authorized");
            }
        },

        requireAdmin() {
            if (!Auth.isAdmin()) {
                throw new Meteor.Error("not-authorized");
            }
        }
};

Meteor.methods({
    setPassword: function(username, password) {
        // Can only be ran if the username has password == null - used for initial login
        var user = Meteor.users.findOne({
            username: username,
            'services.password': null
        });

        if (user !== null) {
            Accounts.setPassword(user._id, password);
        }
    }
})
