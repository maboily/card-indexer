CardSetNewPage = React.createClass({
    getInitialState() {
        return {
            errorMessages: {}
        }
    },

    handleSave(event) {
        event.preventDefault();

        // Retrieve fields
        var fields = {
            name: React.findDOMNode(this.refs.name),
            numberCount: React.findDOMNode(this.refs.numberCount)
        };

        // Save in database
        var setId = Meteor.call('addCardSet', {
            name: fields.name.value.trim(),
            numberCount: fields.numberCount.value.trim()
        }, function (error, setId) {
                if (!error) {
                    // Redirect to view
                    FlowRouter.go('/sets/:setId/view', {setId: setId});
                } else {
                    this.setState({
                        errorMessages: error.reason
                    });
                }
            }.bind(this)
        );
    },

    getPageHeaderButtons() {
        return (
            <button type="submit" className="button mod-create"><i className="fa fa-check fa-lg u-mr-10 u-va-middle"></i>Save</button>
        );
    },

    render() {
        return (
            <div>
                <form onSubmit={this.handleSave} className="form">
                    <PageHeader title="New set" buttons={this.getPageHeaderButtons()} />

                    <ErrorMessages messages={this.state.errorMessages} />

                    <h3>Information</h3>

                    <div className="form-control mod-required">
                        <label>Name</label>
                        <input type="text" ref="name"/>
                    </div>
                    <div className="form-control mod-required">
                        <label>Cards in set</label>
                        <input type="text" ref="numberCount"/>
                    </div>
                </form>
            </div>
        );
    }
});
