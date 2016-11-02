EmbeddedCardListActions = React.createClass({
    propTypes: {
        canSynchronize: React.PropTypes.bool,
        card: React.PropTypes.object.isRequired
    },

    handleRemove() {
        // Validates with user
        if (confirm("Are you sure you want to delete the selected card?")) {
            // Remove from database
            Meteor.call('removeCard', this.props.card._id);
        }
    },

    handleSynchronize() {
        Meteor.call('synchronizeCard', this.props.card._id);
    },

    renderSynchronizeButton() {
        if (this.props.canSynchronize && Auth.isAdmin()) {
            return (
                <button type="button" onClick={this.handleSynchronize} className="button mod-act mod-small"><i className="fa fa-refresh u-mr-5 u-va-middle"></i>Sync</button>
            )
        }
    },

    render() {
        return (
            <div className="buttons-group">
                <a href={'/cards/' + this.props.card._id + '/view'} className="button mod-neutral mod-small"><i className="fa fa-eye u-mr-5 u-va-middle"></i>View</a>
                {Auth.isAdmin() ? <button type="button" onClick={this.handleRemove} className="button mod-dangerous mod-small"><i className="fa fa-trash-o u-mr-5 u-va-middle"></i>Remove</button> : ''}
                {this.renderSynchronizeButton()}
            </div>
        );
    }
});
