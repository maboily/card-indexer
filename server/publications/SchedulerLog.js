Meteor.publish('schedulerLogs', function(limit) {
    Auth.requireLoggedIn.bind(this);

    return SchedulerLog.find({}, {
        sort: {
            createdAt: -1
        },
        limit: limit
    });
});
