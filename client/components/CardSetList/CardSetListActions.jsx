CardSetListActions = React.createClass({
    propTypes: {
        cardSet: React.PropTypes.object.isRequired
    },

    handleRemove() {
        // Validates with user
        if (confirm("Are you sure you want to delete the selected set?")) {
            // Remove from database
            Meteor.call('removeCardSet', this.props.cardSet._id);
        }
    },

    handleSynchronizeCards() {
        // Validates with user
        if (confirm("Are you sure you want to synchronize all the cards contained in the selected set?")) {
            Meteor.call('synchronizeSet', this.props.cardSet._id);
        }
    },

    render() {
        return (
            <div className="buttons-group">
                <a href={'/sets/' + this.props.cardSet._id + '/view'} className="button mod-neutral mod-small"><i className="fa fa-eye u-mr-5 u-va-middle"></i>View</a>
                {Auth.isLoggedIn() ? <a href={'/my-collection/' + this.props.cardSet._id} className="button mod-neutral mod-small"><i className="fa fa-book u-mr-5 u-va-middle"></i>Collection</a> : ''}
                {Auth.isAdmin() ? <button type="button" onClick={this.handleRemove} className="button mod-dangerous mod-small"><i className="fa fa-trash-o u-mr-5 u-va-middle"></i>Remove</button> : ''}
                {Auth.isAdmin() ? <button type="button" onClick={this.handleSynchronizeCards} className="button mod-act mod-small"><i className="fa fa-refresh u-mr-5 u-va-middle"></i>Sync</button> : ''}
            </div>
        );
    }
});
