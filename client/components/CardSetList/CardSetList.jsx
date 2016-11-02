const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

CardSetList = React.createClass({
    propTypes: {
        cardSets: React.PropTypes.array.isRequired
    },

    columns: [
        {
            name: 'name',
            label: 'Name',
            width: '40%'
        },

        {
            name: 'numberCount',
            label: 'Cards in set',
            width: '15%'
        },

        {
            name: 'actions',
            label: 'Actions',
            render: (cardSet) => {
                return (
                    <CardSetListActions cardSet={cardSet} />
                );
            }
        }
    ],

    render() {
        return (
            <TableList columns={this.columns} data={this.props.cardSets} dataKeyColumn='_id' />
        );
    }
});
