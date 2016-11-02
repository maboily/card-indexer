EmbeddedCardList = React.createClass({
    propTypes: {
        canSynchronize: React.PropTypes.bool,
        hideSetRow: React.PropTypes.bool,
        subscriptionName: React.PropTypes.string.isRequired
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe(this.props.subscriptionName, this.props.subscriptionFilter);

        return {
            cards: Cards.find(this.props.filter).fetch(),

            cardsLoading: !handle.ready()
        }
    },

    renderSetRow() {
        if (!this.props.hideSetRow) {
            return (
                <th style={{width: '15%' }}>Set</th>
            )
        }
    },

    columns: [
        {
            name: 'number',
            label: '#',
            width: '10%'
        },

        {
            name: 'name',
            label: 'Name',
            width: '20%'
        },

        {
            name: 'cardSet.name',
            label: 'Set',
            width: '15%'
        },

        {
            name: 'value',
            label: 'Value',
            width: '10%'
        },

        {
            name: 'status',
            label: 'Status',
            width: '15%'
        },

        {
            name: 'actions',
            label: 'Actions',
            render: (card) => {
                return (
                    <EmbeddedCardListActions card={card} />
                );
            }
        }
    ],

    render() {


        if (this.data.cardsLoading) {
            return (
                <LoadingContainer />
            );
        } else {
            return (
                <TableList columns={this.columns} data={this.data.cards} dataKeyColumn='_id' />
            );
        }
    }
});
