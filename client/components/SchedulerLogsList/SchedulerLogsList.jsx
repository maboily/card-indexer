SchedulerLogsList = React.createClass({
    propTypes: {
        limit: React.PropTypes.number
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('schedulerLogs', this.props.limit ? this.props.limit : 100);

        return {
            schedulerLogs: SchedulerLogs.find({},{ sort: { createdAt: -1 }, limit: this.props.limit ? this.props.limit : 100}).fetch(),

            schedulerLogsLoading: !handle.ready()
        }
    },

    columns: [
        {
            name: 'createdAt',
            label: 'Date',
            width: '150px',
            render(log) {
                return log.createdAt.toLocaleString();
            }
        },

        {
            name: 'operation',
            label: 'Operation'
        }
    ],

    render() {
        if (this.data.schedulerLogsLoading) {
            return (
                <LoadingContainer />
            );
        } else {
            return (
                <TableList columns={this.columns} data={this.data.schedulerLogs} dataKeyColumn='_id' />
            );
        }
    }
});
