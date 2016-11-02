CollectionStatsSetItem = React.createClass({
    propTypes: {
        cardSet: React.PropTypes.object.isRequired,
        stats: React.PropTypes.object.isRequired
    },

    render() {
        return (
            <li className="collection-stats-item">
                <h4 className="collection-stats-item-title">{this.props.cardSet.name}</h4>

                <div className="stats-data">
                    <span className="stats-data-label">Normal cards completion</span>
                    <span className="stats-data-value">{this.props.stats.cardsCompleted.normal}/{this.props.cardSet.normalCardsInSet} ({this.props.stats.cardsCompleted.percent.normal}%)</span>
                </div>

                <div className="stats-data">
                    <span className="stats-data-label">Reverse holo cards completion</span>
                    <span className="stats-data-value">{this.props.stats.cardsCompleted.reverseHolo}/{this.props.cardSet.rhCardsInSet} ({this.props.stats.cardsCompleted.percent.reverseHolo}%)</span>
                </div>

                <hr className="stats-break" />

                <div className="stats-data mod-positive">
                    <span className="stats-data-label">Value of normal cards owned</span>
                    <span className="stats-data-value">$US {this.props.stats.worth.normal}</span>
                </div>

                <div className="stats-data mod-positive">
                    <span className="stats-data-label">Value of reverse holo cards owned</span>
                    <span className="stats-data-value">$US {this.props.stats.worth.reverseHolo}</span>
                </div>

                <div className="stats-data mod-positive mod-aggregate">
                    <span className="stats-data-label">Value of all cards owned</span>
                    <span className="stats-data-value">$US {this.props.stats.worth.total}</span>
                </div>

                <hr className="stats-break" />

                <div className="stats-data mod-negative">
                    <span className="stats-data-label">Value of normal cards left to get</span>
                    <span className="stats-data-value">$US {this.props.stats.leftToBuy.normal}</span>
                </div>

                <div className="stats-data mod-negative">
                    <span className="stats-data-label">Value of reverse holo cards left to get</span>
                    <span className="stats-data-value">$US {this.props.stats.leftToBuy.reverseHolo}</span>
                </div>

                <div className="stats-data mod-negative mod-aggregate">
                    <span className="stats-data-label">Value of all cards left to buy</span>
                    <span className="stats-data-value">$US {this.props.stats.leftToBuy.total}</span>
                </div>

                <CollectionStatsSetItemGraph {...this.props} />
            </li>
        )
    }
});
