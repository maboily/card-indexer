const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var LinkedStateMixin = React.addons.LinkedStateMixin;

CardMassAddPage = React.createClass({
    mixins: [LinkedStateMixin, ReactMeteorData],

    getMeteorData() {
        var setsHandle = Meteor.subscribe('cardSets');

        return {
            sets: CardSets.find({}).fetch(),

            setsLoading: !setsHandle.ready()
        }
    },

    getInitialState() {
        return {
            allCardsValid: false,
            cardsSelectedCount: 0,
            cardsValidatedCount: 0,
            cardsToAdd: null,
            errorMessages: {},
            isParsed: false,
            isSaving: false
        }
    },

    resetState() {
        this.replaceState(this.getInitialState());
    },

    handleSubmit(event) {
        event.preventDefault();

        // Resets error messages
        this.setState({
            errorMessages: {}
        });

        if (!this.state.isParsed) { // Parse stage
            // ToDo: Implement parser
            var cardsListTextarea = React.findDOMNode(this.refs.cardsList);

            try {
                MassAddParser.getCardsListWithState(cardsListTextarea.value.trim(), function (cards) {
                    this.setState({
                        cardsToAdd: cards,
                        isParsed: true
                    });
                    this.countCardsSelected();
                    this.countCardsValidated();
                }.bind(this));
            } catch (err) {
                // Parsing failed, report error
                this.setState({
                    errorMessages: {
                        errors: err
                    }
                });
            }
        } else if (!this.state.isSaving) { // Save stage
            this.setState({
                isSaving: true
            });

            // Saves cards in collection
            async.series(this.state.cardsToAdd.map((card) => {
                return (callback) => {
                    if (card.selected) {
                        Meteor.call('addCard', {
                            number: card.number,
                            name: card.name,
                            cardSet: { _id: card.cardSetId },
                            hasReverseHolo: card.hasReverseHolo
                        }, function (err) {
                            callback(err);
                        });
                    }
                }
            }), (err) => {
                if (!err) {
                    FlowRouter.go('/cards');
                }
            });
        }
    },

    getPageHeaderButtons() {
        if (!this.state.isParsed) {
            return (
                <button type="submit" className="button mod-create"><i
                    className="fa fa-align-left fa-lg u-mr-10 u-va-middle"></i>Parse</button>
            );
        }

        if (this.state.isParsed) {
            return [
                (<button key="cancel" type="button" className="button mod-dangerous" onClick={this.resetState}><i className="fa fa-times fa-lg u-mr-10 u-va-middle"></i>Cancel</button>),
                (<button key="submit" type="button" className="button mod-create" onClick={this.handleSubmit} disabled={!this.state.allCardsValid}><i className="fa fa-check fa-lg u-mr-10 u-va-middle"></i>Submit {this.state.cardsSelectedCount} card(s)</button>),
            ];
        }
    },

    renderParsingInterface() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} className="form">
                    <PageHeader title="Add many cards" buttons={this.getPageHeaderButtons()}/>

                    <ErrorMessages messages={this.state.errorMessages}/>

                    <h3>Data</h3>

                    <div className="form-control mod-required">
                        <label>Cards list</label>
                        <textarea className="mass-add-textarea u-mt-5" ref="cardsList" placeholder="Paste data from Bulbapedia here..."></textarea>
                    </div>
                </form>
            </div>
        );
    },

    validateCard(index) {
        this.state.cardsToAdd[index].validated = MassAddParser.validateCard(this.state.cardsToAdd[index]);

        this.countCardsValidated();
    },

    setCardNumber(index) {
        this.state.cardsToAdd[index].number = parseInt(React.findDOMNode(this.refs['number' + index]).value);
        this.validateCard(index);
    },

    setCardName(index) {
        this.state.cardsToAdd[index].name = React.findDOMNode(this.refs['name' + index]).value;
        this.validateCard(index);
    },

    setCardSet(index) {
        this.state.cardsToAdd[index].cardSetId = React.findDOMNode(this.refs['set' + index]).value;
        this.validateCard(index);
    },

    setCardHasReverseHolo(index) {
        this.state.cardsToAdd[index].hasReverseHolo = React.findDOMNode(this.refs['hasReverseHolo' + index]).checked;
        this.validateCard(index);
    },

    setCardSelected(index) {
        this.state.cardsToAdd[index].selected = React.findDOMNode(this.refs['selected' + index]).checked;
        this.countCardsSelected();
        this.countCardsValidated();
    },

    countCardsSelected() {
        this.setState({
            cardsSelectedCount: this.state.cardsToAdd.reduce((lastResult, card) => {
                return lastResult + (card.selected ? 1 : 0);
            }, 0)
        });
    },

    countCardsValidated() {
        var cardsValidatedCount = this.state.cardsToAdd.reduce((lastResult, card) => {
            return lastResult + ((card.validated && card.selected) || !card.selected ? 1 : 0);
        }, 0);

        this.setState({
            allCardsValid: cardsValidatedCount == this.state.cardsToAdd.length,
            cardsValidatedCount: cardsValidatedCount
        });
    },

    renderCardsToAdd() {
        return this.state.cardsToAdd.map((cardToAdd, index) => {
            return (
                <tr key={cardToAdd.uid}>
                    <td><input type="checkbox" ref={'selected' + index} defaultChecked={cardToAdd.selected} onChange={this.setCardSelected.bind(this, index)} /></td>
                    <td><input type="text" ref={'number' + index} defaultValue={cardToAdd.number} onChange={this.setCardNumber.bind(this, index)} /></td>
                    <td><input type="text" ref={'name' + index} defaultValue={cardToAdd.name} onChange={this.setCardName.bind(this, index)} /></td>
                    <td>{this.renderSetSelect(cardToAdd, index)}</td>
                    <td><input type="checkbox" ref={'hasReverseHolo' + index} defaultChecked={cardToAdd.hasReverseHolo} onChange={this.setCardHasReverseHolo.bind(this, index)} /></td>
                    <td><i className={'fa ' + (cardToAdd.validated ? 'fa-check u-text-green' : 'fa-times u-text-red')}></i></td>
                </tr>
            )
        });
    },

    renderSetSelect(cardToAdd, index) {
        if (!this.setsLoading) {
            var items = this.data.sets.map((set) => {
                return (
                    <option key={set._id} value={set._id}>{set.name}</option>
                );
            });


            return (
                <select ref={'set' + index} defaultValue={cardToAdd.cardSetId} onChange={this.setCardSet.bind(this, index)}>
                    <option value="">-- Select a set --</option>
                    {items}
                </select>
            );
        }
    },

    renderSaveInterface() {
        return (
            <div>
                <PageHeader title="Parser results" buttons={this.getPageHeaderButtons()}/>

                <table className="list-table mod-controls">
                    <thead>
                    <tr>
                        <th style={{width: '10%' }}>&nbsp;</th>
                        <th style={{width: '10%' }}>#</th>
                        <th>Name</th>
                        <th>Set</th>
                        <th>Reverse Holo</th>
                        <th style={{width: '10%' }}>Validation</th>
                    </tr>
                    </thead>

                    <ReactCSSTransitionGroup transitionName="list-table" component="tbody" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                        {this.renderCardsToAdd()}
                    </ReactCSSTransitionGroup>
                </table>
            </div>
        );
    },

    render () {
        if (!this.state.isParsed) {
            return this.renderParsingInterface();
        }

        if (this.state.isParsed) {
            return this.renderSaveInterface();
        }
    }
});
