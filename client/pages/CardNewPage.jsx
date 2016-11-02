CardNewPage = React.createClass({
    mixins: [ReactMeteorData],

    getInitialState() {
        return {
            errorMessages: {}
        }
    },

    getMeteorData() {
        var setsHandle = Meteor.subscribe('cardSets');

        return {
            sets: CardSets.find({}).fetch(),

            setsLoading: !setsHandle.ready()
        }
    },

    handleSave(event) {
        event.preventDefault();

        // Retrieve fields
        var fields = {
            number: React.findDOMNode(this.refs.number),
            name: React.findDOMNode(this.refs.name),
            set: React.findDOMNode(this.refs.set),
            hasReverseHolo: React.findDOMNode(this.refs.hasReverseHolo)
        };

        // Fetches associated set
        var associatedSet = CardSets.findOne({ _id: fields.set.value.trim() });


        // Save in database
        Meteor.call('addCard', {
            number: fields.number.value.trim(),
            name: fields.name.value.trim(),
            cardSet: { _id: fields.set.value.trim() },
            hasReverseHolo: fields.hasReverseHolo.checked,
        },
        function (error, cardId) {
            if (!error) {
                // Redirect to view
                FlowRouter.go('/cards/:cardId/view', {cardId: cardId});
            } else {
                this.setState({
                    errorMessages: error.reason
                });
            }
        }.bind(this));

    },

    renderSetSelect() {
        var items = this.data.sets.map((set) => {
            return (
                <option key={set._id} value={set._id}>{set.name}</option>
            );
        });

        return (
            <select ref="set">{items}</select>
        );
    },

    getPageHeaderButtons() {
        return (
            <button type="submit" className="button mod-create"><i className="fa fa-check fa-lg u-mr-10 u-va-middle"></i>Save</button>
        );
    },

    render(){
        if (this.data.setsLoading) {
            return (
                <LoadingContainer />
            );
        } else {
            return (
                <form onSubmit={this.handleSave} className="form">
                    <PageHeader title="New card" buttons={this.getPageHeaderButtons()} />

                    <ErrorMessages messages={this.state.errorMessages} />

                    <h3>Information</h3>

                    <div className="form-control mod-required">
                        <label>Number</label>
                        <input type="text" ref="number"/>
                    </div>
                    <div className="form-control mod-required">
                        <label>Name</label>
                        <input type="text" ref="name"/>
                    </div>
                    <div className="form-control mod-required">
                        <label>Set</label>
                        {this.renderSetSelect()}
                    </div>
                    <div className="form-control">
                        <label>Has reverse holo</label>
                        <input type="checkbox" ref="hasReverseHolo"/>
                    </div>
                </form>
            );
        }
    }
});
