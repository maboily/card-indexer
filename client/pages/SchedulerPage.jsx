SchedulerPage = React.createClass({
    mixins: [ReactMeteorData],

    cardListFilter: { status: { $ne: 'Synchronized' }},

    getMeteorData() {
        var handle = Meteor.subscribe('schedulerSettings');

        return {
            scheduler: SchedulerSettings.findOne(),

            schedulerLoading: !handle.ready()
        }
    },

    changeIsActive() {
        // Save to database
        var setting = React.findDOMNode(this.refs.isActive);

        Meteor.call('schedulerToggleActive', setting.checked);
    },

    changeRunAt() {
        // Save to database
        var setting = React.findDOMNode(this.refs.runAt);

        Meteor.call('schedulerChangeRunAt', setting.value.trim());
    },

    synchronizeAll() {
        // Let's confirm with the user first... this can be a pretty hefty operation
        if (confirm('Warning! You are about to synchronize all cards\' price. Press OK to launch the synchronization')) {
            Meteor.call('synchronizeAllCards');
        }
    },

    renderSettings()
    {
        return (
            <div className="form">
                <div className="form-control">
                    <label>
                        <input type="checkbox" ref="isActive" checked={this.data.scheduler.isActive} onChange={this.changeIsActive} />
                        Enable card indexer
                    </label>
                </div>

                <div className="form-control">
                    <label>Run at the specified time</label>
                    <input type="text" ref="runAt" value={this.data.scheduler.runAt} onChange={this.changeRunAt} />
                </div>

                <button type="button" className="button mod-act" onClick={this.synchronizeAll}>Synchronize All</button>
            </div>
        );
    },

    render() {
        if (this.data.schedulerLoading) {
            return (
                <LoadingContainer placeholderHeight={1200} />
            );
        } else {
            return (
                <div>
                    <PageHeader title="Scheduler" />

                    {this.renderSettings()}

                    <h3>Queued Cards</h3>

                    <EmbeddedCardList subscriptionName='cardsQueued' filter={this.cardListFilter}
                                      canSynchronize={false}/>

                    <h3>Logs</h3>

                    <SchedulerLogsList />
                </div>
            )
        }
    }
});
