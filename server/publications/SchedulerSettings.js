Meteor.publish('schedulerSettings', function() {
    Auth.requireLoggedIn.bind(this);

    return SchedulerSettings.find();
});
