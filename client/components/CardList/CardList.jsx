CardList = React.createClass({
    propTypes: {
        cards: React.PropTypes.array.isRequired,
        onSort: React.PropTypes.func.isRequired,
        currentSortName: React.PropTypes.string,
        currentSortIsAscending: React.PropTypes.bool
    },

    columns: [
        {
            name: 'number',
            isSortable: true,
            label: '#',
            width: '10%',
            render(card) {
                return `${card.number}/${card.cardSet.numberCount}`;
            }
        },

        {
            name: 'name',
            isSortable: true,
            label: 'Name',
            width: '20%'
        },

        {
            name: 'cardSet.name',
            isSortable: true,
            label: 'Set',
            width: '15%'
        },

        {
            name: 'value',
            isSortable: true,
            label: 'Value',
            width: '10%'
        },

        {
            name: 'status',
            label: 'Status',
            width: '15%'
        },

        {
            name: 'actions',
            label: 'Actions',
            render(card) {
                return (
                    <CardListActions card={card} />
                );
            }
        }
    ],

    render() {
        return (
            <TableList columns={this.columns} data={this.props.cards} onSort={this.props.onSort} currentSort={this.props.currentSortName}
                currentSortIsAscending={this.props.currentSortIsAscending} dataKeyColumn='_id' />
        );
    }
});
