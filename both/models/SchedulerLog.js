SchedulerLogs = new Mongo.Collection('scheduler_logs');

SchedulerLog = Astro.Class({
    name: 'SchedulerLog',
    collection: SchedulerLogs,

    fields: {
        createdAt: {
            type: 'date',
            immutable: true
        },
        operation: 'string'
    }
});
