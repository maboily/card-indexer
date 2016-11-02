TableListHeaderColumn = React.createClass({
    propTypes: {
        canSort: React.PropTypes.bool,
        onSort: React.PropTypes.func,
        sortName: React.PropTypes.string,
        headerText: React.PropTypes.string.isRequired,
        currentSort: React.PropTypes.string,
        currentSortIsAscending: React.PropTypes.bool,
        width: React.PropTypes.string
    },

    handleNewSort() {
        this.props.onSort(this.props.sortName, true);
    },

    handleToggleDirection() {
        this.props.onSort(this.props.sortName, !this.props.currentSortIsAscending);
    },

    renderInnerHeader() {
        if (this.props.canSort) {
            // Checks if this is the current sort
            if (this.props.currentSort == this.props.sortName) {
                return (
                    <span className="sortable-column">
                        <a href="javascript: void(0)" onClick={this.handleToggleDirection} className="sortable-column-text">{this.props.headerText}</a>
                        <a href="javascript: void(0)" onClick={this.handleToggleDirection} className="sortable-column-indicator"><i className={'u-ml-10 fa ' + (this.props.currentSortIsAscending ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc')}></i></a>
                    </span>
                )
            } else {
                // Not the current sort, simply return a link to permit sort here
                return (
                    <span className="sortable-column">
                        <a href="javascript: void(0)" onClick={this.handleToggleDirection} className="sortable-column-text">{this.props.headerText}</a>
                        <a href="javascript: void(0)" onClick={this.handleToggleDirection} className="sortable-column-indicator mod-inactive"><i className="u-ml-10 fa fa-sort-amount-asc"></i></a>
                    </span>
                );
            }
        } else {
            // No sort, render unclickable text
            return this.props.headerText;
        }
    },

    render() {
        return (
            <th style={{width:this.props.width}}>{this.renderInnerHeader()}</th>
        );
    }
});
