Pagination = React.createClass({
    propTypes: {
        currentPage: React.PropTypes.number.isRequired,
        elementsPerPage: React.PropTypes.number.isRequired,
        totalElements: React.PropTypes.number.isRequired,
        onPageChanged: React.PropTypes.func.isRequired
    },

    render() {
        var listElements = [];
        for (var p = 1; p <= Math.ceil(this.props.totalElements / this.props.elementsPerPage); p++) {
            listElements.push(<li key={p} className={'pagination-list-item ' + (this.props.currentPage == p ? 'mod-active' : '')} onClick={this.props.onPageChanged.bind(null, p)}>{p}</li>);
        }

        if (listElements.length > 0) {
            return (
                <div className="pagination">
                    <span className="pagination-description">Page:</span>

                    <ul className="pagination-list">
                        {listElements}
                    </ul>
                </div>
            );
        } else {
            return (
                <div className="pagination"></div>
            )
        }
    }
});