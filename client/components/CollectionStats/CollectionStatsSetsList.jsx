CollectionStatsSetsList = React.createClass({
    propTypes: {
        cards: React.PropTypes.array.isRequired,
        cardSets: React.PropTypes.array.isRequired,
        collectionEntries: React.PropTypes.array.isRequired
    },

    getStatsForCardSet(cardSet) {
        let statsParser = new CollectionStatsParser(cardSet, this.props.cards, this.props.collectionEntries);

        return statsParser.getFullSummary();
    },

    renderStatsItems() {
        return this.props.cardSets.map((cardSet) => {
            return (
                <CollectionStatsSetItem
                    key={cardSet._id}
                    stats={this.getStatsForCardSet(cardSet)}
                    cardSet={cardSet} />
            );
        });
    },

    renderStatsChart() {

    },

    render() {
        return (
            <div>
                <ul className="collection-stats">
                    {this.renderStatsItems()}
                </ul>
            </div>
        );
    }
});
