const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

CardScanList = React.createClass({
    propTypes: {
        cards: React.PropTypes.array.isRequired,
        inCollection: React.PropTypes.bool,
        reverseHoloView: React.PropTypes.bool,
        onCollectionSave: React.PropTypes.func
    },

    renderCards() {
        if (this.props.cards.length > 0) {
            return this.props.cards.map((data) => {
                return <CardScanListItem key={data._id} data={data} reverseHoloView={this.props.reverseHoloView} inCollection={this.props.inCollection} onCollectionSave={this.props.onCollectionSave} />;
            });
        } else {
            return <div className="scan-empty">No results available</div>;
        }
    },

    render() {
        return (
            <ReactCSSTransitionGroup className="scans-view" transitionName="scan-list" transitionEnterTimeout={500}
                                     transitionLeaveTimeout={300}>
                {this.renderCards()}
            </ReactCSSTransitionGroup>
        );
    }
});
