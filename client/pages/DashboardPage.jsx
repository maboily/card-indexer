DashboardPage = React.createClass({
    render() {
        if (Auth.isAdmin()) {
            // Admin layout
            return (
                <div>
                    <PageHeader title="Dashboard"/>

                    <div className="dashboard">
                        <div className="dashboard-column">
                            <DashboardQuickActions />

                            <h3>Last Visited Cards</h3>
                            <DashboardLastVisitedList />
                        </div>

                        <div className="dashboard-column">
                            <div className="dashboard-block">
                                <h3>Latest scheduler logs</h3>

                                <SchedulerLogsList limit={5}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            // Standard layout
            return (
                <div>
                    <PageHeader title="Dashboard"/>

                    <DashboardLastVisitedList />
                </div>
            );
        }
    }
});
