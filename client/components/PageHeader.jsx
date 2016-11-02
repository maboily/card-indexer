PageHeader = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        buttons: React.PropTypes.node
    },

    render() {
        return (
            <div className="page-header">
                <h2 className="page-header-title">{this.props.title}</h2>

                <div className="page-header-buttons">{this.props.buttons}</div>
            </div>
        );
    }
});
