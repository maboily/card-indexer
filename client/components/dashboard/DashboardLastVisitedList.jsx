DashboardLastVisitedList = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('cardsLastVisited');

        return {
            cardsLastVisited: CardsLastVisited.find({},{ sort: { createdAt: -1 }, limit: 10}).fetch(),

            loading: !handle.ready()
        }
    },

    columns: [
        {
            name: 'card.number',
            label: '#',
            width: '10%',
            render(cardLastVisited) {
                return `${cardLastVisited.card.number}/${cardLastVisited.card.cardSet.numberCount}`;
            }
        },

        {
            name: 'card.name',
            label: 'Name'
        }
    ],

    render() {
        if (this.data.loading) {
            return (
                <LoadingContainer />
            );
        } else {
            return (
                <TableList columns={this.columns} data={this.data.cardsLastVisited} dataKeyColumn='_id' />
            );
        }
    }
});
