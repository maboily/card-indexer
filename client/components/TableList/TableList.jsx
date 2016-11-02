const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

TableList = React.createClass({
    propTypes: {
        columns: React.PropTypes.array.isRequired,
        currentSort: React.PropTypes.string,
        currentSortIsAscending: React.PropTypes.bool,
        data: React.PropTypes.array,
        dataKeyColumn: React.PropTypes.string.isRequired,
        onSort: React.PropTypes.func
    },

    renderColumnsHeaders() {
        return this.props.columns.map((column) => {
            return (
                <TableListHeaderColumn key={column.name} canSort={column.isSortable} onSort={this.props.onSort} currentSort={this.props.currentSort}
                    currentSortIsAscending={this.props.currentSortIsAscending} width={column.width} headerText={column.label} sortName={column.name} />
            );
        });
    },

    renderData() {
        // Is there any data?
        if (this.props.data && this.props.data.length > 0) {
            return this.props.data.map((row) => { return this.renderTableRow(row); });
        } else {
            return (
                <TableListEmptyRow colspan={this.props.columns.length} />
            );
        }
    },

    renderTableRow(row) {
        var renderedColumns = this.props.columns.map((column) => { return this.renderTableColumn(row, column); });

        return (
            <tr key={row[this.props.dataKeyColumn]}>
                {renderedColumns}
            </tr>
        );
    },

    renderTableColumn(row, column) {
        var columnContent = '';

        if (column.render) {
            columnContent = column.render(row);
        } else {
            columnContent = this.defaultRenderColumn(row, column);
        }

        return <td key={column.name}>{columnContent}</td>
    },

    defaultRenderColumn(row, column) {
        // Source: http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
        var obj = row;
        var propertiesTree = column.name.split(".");
        while(propertiesTree.length && (obj = obj[propertiesTree.shift()]));
        return obj;
    },

    render() {
        return (
            <table className="list-table">
                <thead>
                    <tr>
                        {this.renderColumnsHeaders()}
                    </tr>
                </thead>

                <ReactCSSTransitionGroup transitionName="list-table" component="tbody" transitionEnterTimeout={500}
                                         transitionLeaveTimeout={300}>
                     {this.renderData()}
                </ReactCSSTransitionGroup>
            </table>
        )
    }
});
