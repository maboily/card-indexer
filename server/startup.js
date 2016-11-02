Meteor.startup(() => {
    // Is scheduler config created?
    if (SchedulerSettings.find().count() == 0) {
        // Create initial scheduler configuration
        SchedulerSettings.insert({
            isActive: true,
            runAt: '00:00'
        });
    }

    // Is there a single user?
    if (Meteor.users.find().count() == 0) {
        // Creates initial user, without a password
        Meteor.users.insert({
            username: 'admin',
            password: null,
            group: 'admin'
        });
    }
});
