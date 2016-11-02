CollectionStatsPage = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        let cardsHandle = Meteor.subscribe('cards'),
            cardSetsHandle = Meteor.subscribe('cardSets'),
            cardCollectionEntriesHandle = Meteor.subscribe('cardsCollectionEntries');

        return {
            cards: Cards.find().fetch(),
            cardsLoading: !cardsHandle.ready(),
            cardSets: CardSets.find().fetch(),
            cardSetsLoading: !cardSetsHandle.ready(),
            cardCollectionEntries: CardsCollectionEntries.find().fetch(),
            cardCollectionEntriesLoading: !cardCollectionEntriesHandle.ready()
        };
    },

    renderStats() {
        if (this.data.cardSetsLoading || this.data.cardCollectionEntriesLoading || this.data.cardsLoading) {
            return (
                <LoadingContainer />
            );
        } else {
            return (
                <CollectionStatsSetsList
                    cards={this.data.cards}
                    cardSets={this.data.cardSets}
                    collectionEntries={this.data.cardCollectionEntries} />
            );
        }
    },

    render() {
        return (
            <div>
                <PageHeader title="My Collection" />

                <div>
                    <h3>Stats</h3>

                    {this.renderStats()}
                </div>
            </div>
        )
    }
})
