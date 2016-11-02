SchedulerSettings = new Mongo.Collection('scheduler_settings');

Meteor.methods({
    schedulerToggleActive: function(isActive) {
        Auth.requireAdmin();

        SchedulerSettings.update({}, {
            $set: {
                isActive: isActive
            }
        });
    },

    schedulerChangeRunAt: function(runAt) {
        Auth.requireAdmin();

        SchedulerSettings.update({}, {
            $set: {
                runAt: runAt
            }
        });
    }
});
