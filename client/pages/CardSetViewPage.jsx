CardSetViewPage = React.createClass({
    propTypes: {
        setId: React.PropTypes.string.isRequired
    },

    mixins: [ReactMeteorData],

    cardListFilter() {
        return {
            'cardSet._id': this.props.setId
        }
    },

    getInitialState() {
        return {
            errorMessages: {}
        }
    },

    getMeteorData() {
        var setId = this.props.setId;

        Meteor.subscribe('cardSets');

        var data = {};

        data.set = CardSets.findOne({_id: setId});

        return data;
    },

    handleSave(event) {
        event.preventDefault();

        // Gets update fields
        var fields = {
            name: React.findDOMNode(this.refs.name),
            numberCount: React.findDOMNode(this.refs.numberCount)
        };

        // Save to database
        Meteor.call('updateCardSet', this.props.setId, {
            name: fields.name.value.trim(),
            numberCount: fields.numberCount.value.trim()
        }, function (error) {
                if (!error) {
                    // Redirect to view
                    FlowRouter.go('/sets/:setId/view', {setId: this.props.setId});
                } else {
                    this.setState({
                        errorMessages: error.reason
                    });
                }
            }.bind(this));
    },

    getContent() {
        return (
            <div>
                {this.props.isEditing ? this.getEditableContent() : this.getReadonlyContent()}

                <h3>Cards</h3>

                <EmbeddedCardList subscriptionName='cardsInSet' subscriptionFilter={this.props.setId} filter={this.cardListFilter()} hideSetRow={true} />
            </div>
        );
    },

    getEditableContent() {
        return (
            <div>
                <form onSubmit={this.handleSave} className="form">
                    <PageHeader title="View set" buttons={this.getPageHeaderButtons()} />

                    <ErrorMessages messages={this.state.errorMessages} />

                    <h3>Information</h3>

                    <span className="form-control mod-required">
                        <label>Name</label>
                        <input type="text" ref="name" defaultValue={this.data.set.name}/>
                    </span>

                    <span className="form-control mod-required">
                        <label>Cards in set</label>
                        <input type="text" ref="numberCount" defaultValue={this.data.set.numberCount}/>
                    </span>

                </form>
            </div>
        );
    },

    getReadonlyContent() {
        return (
            <div className="form">
                <PageHeader title="View set" buttons={this.getPageHeaderButtons()} />

                <h3>Information</h3>

                <span className="form-control">
                    <label>Name</label>
                    <span>{this.data.set.name}</span>
                </span>

                <span className="form-control">
                    <label>Cards in set</label>
                    <span>{this.data.set.numberCount}</span>
                </span>
            </div>
        );
    },

    getPageHeaderButtons() {
        if (Auth.isAdmin()) {
            if (!this.props.isEditing) {
                return (
                    <a href={'/sets/' + this.props.setId + '/edit'} className="button mod-neutral"><i className="fa fa-pencil fa-lg u-mr-10 u-va-middle"></i>Edit</a>
                );
            } else {
                return [
                    (<a key="cancel" href={'/sets/' + this.props.setId + '/view'} className="button mod-dangerous"><i className="fa fa-times fa-lg u-mr-10 u-va-middle"></i>Cancel</a>),
                    (<button key="save" type="submit" className="button mod-create"><i className="fa fa-check fa-lg u-mr-10 u-va-middle"></i>Save</button>)
                ]
            }
        }
    },

    render() {
        return (
            <div>
                {this.data.set ? this.getContent() : <LoadingContainer />}
            </div>
        );
    }
});
