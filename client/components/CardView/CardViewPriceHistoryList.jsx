CardViewPriceHistoryList = React.createClass({
    mixins: [ReactMeteorData],

    propTypes: {
        cardId: React.PropTypes.string.isRequired
    },

    getMeteorData() {
        var handle = Meteor.subscribe('cardsPriceHistory', this.props.cardId);

        return {
            priceHistories: CardsPriceHistory.find({cardId: this.props.cardId}, {sort: { createdAt: -1 }}).fetch()
        }
    },

    columns: [
        {
            name: 'createdAt',
            label: 'Date',
            render(row) {
                return row.createdAt.toLocaleString();
            }
        },

        {
            name: 'type',
            label: 'Type'
        },

        {
            name: 'details',
            label: 'Details',
            render(row) {
                return `Price changed to ${row.value}`;
            }
        }
    ],

    render() {
        return (
            <TableList columns={this.columns} data={this.data.priceHistories} dataKeyColumn='_id' />
        );
    }
});
