CardViewPage = React.createClass({
    propTypes: {
        cardId: React.PropTypes.string.isRequired
    },

    mixins: [ReactMeteorData],

    getMeteorData() {
        var cardId = this.props.cardId;

        var cardsHandle = Meteor.subscribe('cardById', cardId);
        var setsHandle = Meteor.subscribe('cardSets');

        return {
            card: Cards.findOne({_id: cardId}),
            sets: CardSets.find({}).fetch(),

            cardLoading: !cardsHandle.ready(),
            setsLoading: !setsHandle.ready()
        };
    },

    getInitialState() {
        return {
            errorMessages: {},
            viewReverseHoloScan: false
        };
    },

    componentDidMount() {
        // Set card as visited
        Meteor.call('setLastVisited', this.props.cardId);
    },

    handleSave(event) {
        event.preventDefault();

        // Gets update fields
        var fields = {
            number: React.findDOMNode(this.refs.number),
            name: React.findDOMNode(this.refs.name),
            value: React.findDOMNode(this.refs.value),
            set: React.findDOMNode(this.refs.set),
            hasReverseHolo: React.findDOMNode(this.refs.hasReverseHolo),
            valueReverseHolo: React.findDOMNode(this.refs.valueReverseHolo)
        };

        // Fetches associated set
        Meteor.call('updateCard',
            this.props.cardId,
            {
                number: fields.number.value.trim(),
                name: fields.name.value.trim(),
                cardSet: { _id: fields.set.value.trim() },
                value: fields.value.value.trim(),
                hasReverseHolo: fields.hasReverseHolo.checked,
                valueReverseHolo: fields.valueReverseHolo ? fields.valueReverseHolo.value.trim() : null,
            },
            function (error, cardId) {
                if (!error) {
                    // Redirect to view
                    FlowRouter.go('/cards/:cardId/view', {cardId: this.props.cardId});
                } else {
                    this.setState({
                        errorMessages: error.reason
                    });
                }
            }.bind(this));
    },

    handleSynchronize() {
        Meteor.call('synchronizeCard', this.props.cardId);
    },

    toggleScanView() {
        this.setState({
            viewReverseHoloScan: React.findDOMNode(this.refs.viewReverseHoloScan).checked
        });
    },

    getViewReverseHolo() {
        if (this.data.card.hasReverseHolo) {
            return (
                <span>
                    <input type="checkbox" ref="viewReverseHoloScan" onChange={this.toggleScanView} /> View Reverse Holo
                </span>
            );
        }
    },

    getScanPhoto() {
        if (this.state.viewReverseHoloScan) {
            return (
                <img src={this.data.card.scanUrlRH}
                     className={'scan-photo ' + (!this.data.card.scanUrlRH ? 'mod-empty' : '')}/>
            );
        } else {
            return (
                <img src={this.data.card.scanUrl}
                     className={'scan-photo ' + (!this.data.card.scanUrl ? 'mod-empty' : '')}/>
            );
        }
    },

    getContent() {
        return (
            <div>
                <PageHeader title="View card" buttons={this.getPageHeaderButtons()} />

                <div className="card-view">
                    <div className="card-view-info">
                        {this.props.isEditing ? this.getEditableContent() : this.getReadonlyContent()}
                    </div>

                    <div className="card-view-scan">
                        <h3>Scan</h3>

                        {this.getViewReverseHolo()}

                        {this.getScanPhoto()}
                    </div>

                    <div className="card-view-price-history">
                        <h3>Price History</h3>

                        <CardViewPriceHistoryList cardId={this.props.cardId}/>
                    </div>
                </div>
            </div>
        )
    },

    renderSetSelect() {
        var items = this.data.sets.map((set) => {
            return (
                <option key={set._id} value={set._id}>{set.name}</option>
            );
        });

        return (
            <select ref="set" defaultValue={this.data.card.cardSet._id}>{items}</select>
        );
    },

    getEditableReverseHoloPrice() {
        if (this.data.card.hasReverseHolo) {
            return (
                <span className="form-control">
                    <label>Reverse Holo Price</label>
                    <input type="text" ref="valueReverseHolo" defaultValue={this.data.card.valueReverseHolo} />
                </span>
            );
        }
    },

    getEditableContent() {
        return (
            <div>
                <form onSubmit={this.handleSave} className="form">
                    <ErrorMessages messages={this.state.errorMessages} />

                    <h3>Information</h3>

                    <span className="form-control mod-number mod-required">
                        <label>Number</label>
                        <input type="text" ref="number"
                               defaultValue={this.data.card.number}/>/{this.data.card.cardSet.numberCount}
                    </span>

                    <span className="form-control mod-required">
                        <label>Name</label>
                        <input type="text" ref="name" defaultValue={this.data.card.name}/>
                    </span>

                    <span className="form-control mod-required">
                        <label>Set</label>
                        {this.renderSetSelect()}
                    </span>

                    <span className="form-control">
                        <label>Current Price</label>
                        <input type="text" ref="value" defaultValue={this.data.card.value}/>
                    </span>

                    <span className="form-control">
                        <label>Has reverse holo?</label>
                        <input type="checkbox" ref="hasReverseHolo" defaultChecked={this.data.card.hasReverseHolo} />
                    </span>

                    {this.getEditableReverseHoloPrice()}
                </form>
            </div>
        );
    },

    getReadonlyReverseHoloPrice() {
        if (this.data.card.hasReverseHolo) {
            return (
                <span className="form-control">
                    <label>Reverse Holo Price</label>
                    <span>{this.data.card.valueReverseHolo}</span>
                </span>
            );
        }
    },

    getReadonlyContent() {
        return (
            <div className="form">
                <h3>Information</h3>

                <span className="form-control">
                    <label>Number</label>
                    <span>{this.data.card.number}/{this.data.card.cardSet.numberCount}</span>
                </span>

                <span className="form-control">
                    <label>Name</label>
                    <span>{this.data.card.name}</span>
                </span>

                <span className="form-control">
                    <label>Set</label>
                    <span>{this.data.card.cardSet.name}</span>
                </span>

                <span className="form-control">
                    <label>Current Price</label>
                    <span>{this.data.card.value}</span>
                </span>

                {this.getReadonlyReverseHoloPrice()}
            </div>
        );
    },

    getLoading() {
        return (
            <p>Loading...</p>
        );
    },

    getPageHeaderButtons() {
        if (Auth.isAdmin()) {
            if (!this.props.isEditing) {
                return [
                    (<a key="edit" href={'/cards/' + this.props.cardId + '/edit'} className="button mod-neutral"><i className="fa fa-pencil fa-lg u-mr-10 u-va-middle"></i>Edit</a>),
                    (<button key="synchronize" type="button" className="button mod-act" onClick={this.handleSynchronize}><i className="fa fa-refresh fa-lg u-mr-10 u-va-middle"></i>Synchronize</button>)
                ];
            } else {
                return [
                    (<a key="cancel" href={'/cards/' + this.props.cardId + '/view'} className="button mod-dangerous"><i className="fa fa-times fa-lg u-mr-10 u-va-middle"></i>Cancel</a>),
                    (<button key="save" type="button" className="button mod-create" onClick={this.handleSave}><i className="fa fa-check fa-lg u-mr-10 u-va-middle"></i>Save</button>)
                ]
            }
        }
    },

    render() {
        if (this.data.cardLoading && this.data.setLoading) {
            return (
                <LoadingContainer />
            );
        } else {
            return (
                <div>
                    {this.data.card ? this.getContent() : this.getLoading()}
                </div>
            );
        }
    }
});
