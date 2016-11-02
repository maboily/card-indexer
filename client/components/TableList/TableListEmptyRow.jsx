TableListEmptyRow = React.createClass({
    render () {
        return (
            <tr className="empty-row">
                <td colSpan={this.props.colspan}>
                    No results available
                </td>
            </tr>
        );
    }
});
