LoadingContainer = React.createClass({
    propTypes: {
        placeholderHeight: React.PropTypes.number,
        small: React.PropTypes.bool
    },

    render () {
        if (this.props.small) {
            return (
                <div className="loading center-layout mod-small">
                    Loading...
                </div>
            );
        } else {
            return (
                <div className="loading center-layout" style={{height: this.props.placeholderHeight ? this.props.placeholderHeight : 'auto'}}>
                    <img src="/images/ajax-loader.gif" className="loading-image" />
                    <span className="loading-text">Loading... Please wait!</span>
                </div>
            );
        }

    }
});
