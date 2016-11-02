DashboardQuickActions = React.createClass({
    synchronizeAll() {
        // Let's confirm with the user first... this can be a pretty hefty operation
        if (confirm('Warning! You are about to synchronize all cards\' price. Press OK to launch the synchronization')) {
            Meteor.call('synchronizeAllCards');
        }
    },

    render() {
        return (
            <div className="dashboard-block">
                <h3>Quick Actions</h3>

                <ul className="quick-actions">
                    <li><a href="/cards/new">Add a new card</a></li>
                    <li><a href="/cards">View or search cards</a></li>
                    <li><a href="javascript:void(0)" onClick={this.synchronizeAll}>Update cards price</a></li>
                </ul>
            </div>
        );
    }
});