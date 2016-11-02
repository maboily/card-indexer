const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

CardScanListItem = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        reverseHoloView: React.PropTypes.bool,
        inCollection: React.PropTypes.bool,
        amountOwned: React.PropTypes.number,
        onCollectionSave: React.PropTypes.func
    },

    saveTimer: null,

    getInitialState() {
        return {
            tabsFocusOnRH: false,
            saveSuccess: false
        }
    },

    renderScanImage() {
        if (this.props.reverseHoloView && this.props.data.hasReverseHolo) {
            return (
                <img src={this.props.data.scanUrlRH} className={'scan-photo mod-zoom ' + (!this.props.data.scanUrlRH ? 'mod-empty' : '')} />
            );
        } else {
            return (
                <img src={this.props.data.scanUrl} className={'scan-photo mod-zoom ' + (!this.props.data.scanUrl ? 'mod-empty' : '')} />
            );
        }
    },

    renderReverseHoloPrice() {
        if (this.props.data.hasReverseHolo) {
            return (
                <span> (Reverse Holo: {this.props.data.valueReverseHolo})</span>
            );
        }
    },

    renderAmountOwned() {
        var renderedRHOwned = null;
        if (this.props.data.hasReverseHolo) {
            renderedRHOwned = (
                <div className={'scan-amount ' + (this.props.reverseHoloView ? 'mod-active' : '')}>
                    <input type="text" className="scan-amount-input" defaultValue={this.props.data.amountOwnedRH} ref="amountOwnedRH" onChange={this.handleSaveCollection} />
                    <label className="scan-amount-label">RH</label>
                </div>
            );
        }

        return (
            <div className="scan-amounts">
                <div className={'scan-amount ' + (!this.props.reverseHoloView ? 'mod-active' : '')}>
                    <input type="text" className="scan-amount-input" defaultValue={this.props.data.amountOwnedNormal} ref="amountOwnedNormal" onChange={this.handleSaveCollection} />
                    <label className="scan-amount-label">Normal</label>
                </div>

                {renderedRHOwned}
            </div>
        )
    },

    renderCollectionControls() {
        return (
            <div className="scan-collection-controls">
                {this.renderCollectionSaveFlag()}

                {this.renderAmountOwned()}
            </div>
        );
    },

    renderCollectionSaveFlag() {
        if (this.state.saveSuccess) {
            return (
                <div className="scan-collection-save-flag">
                    Saved!
                </div>
            );
        }
    },

    handleSaveCollection() {
        // Gets fields
        var fields = {
            amountOwnedNormal: React.findDOMNode(this.refs.amountOwnedNormal),
            amountOwnedRH: this.refs.amountOwnedRH ? React.findDOMNode(this.refs.amountOwnedRH) : null
        };

        // Parse data
        var amountOwnedNormal = parseInt(fields.amountOwnedNormal.value.trim());
        var amountOwnedRH = fields.amountOwnedRH ? parseInt(fields.amountOwnedRH.value.trim()) : 0;

        // Call parent function
        this.props.onCollectionSave(this.props.data._id, amountOwnedNormal, amountOwnedRH);

        // Timeout to remove save success message
        this.setState({
            saveSuccess: true
        });
        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => { this.setState({ saveSuccess: false }); }, 1500);
    },

    isOwned() {
        return this.props.data.amountOwnedNormal > 0 || this.props.data.amountOwnedRH > 0;
    },

    render() {
        return (
            <li className={`scan ${this.props.inCollection && !this.isOwned() ? 'not-owned' : ''}`} key={this.props.data._id}>
                {this.props.inCollection ? this.renderCollectionControls() : ''}

                <a href={'/cards/' + this.props.data._id + '/view'} tabIndex={this.props.inCollection ? -1 : null}>
                    {this.renderScanImage()}
                </a>

                <a href={'/cards/' + this.props.data._id + '/view'} className="scan-title" tabIndex={this.props.inCollection ? -1 : null}>
                    {this.props.data.number}/{this.props.data.cardSet.numberCount} - {this.props.data.name}
                </a>

                <span className="scan-price">
                    {this.props.data.value} {this.renderReverseHoloPrice()}
                </span>
            </li>
        );
    }
});
