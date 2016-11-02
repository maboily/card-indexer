ErrorMessages = React.createClass({
    propTypes: {
        messages: React.PropTypes.object.isRequired
    },

    render() {
        var errorMessages = [];

        for (let field in this.props.messages) {
            errorMessages.push(this.props.messages[field]);
        }

        return (
            <ul className="errors-list">
                {errorMessages}
            </ul>
        );
    }
});