CardListFilters = React.createClass({
    mixins: [ReactMeteorData],

    propTypes: {
        filters: React.PropTypes.object.isRequired,
        onFilterChanged: React.PropTypes.func.isRequired
    },

    getMeteorData() {
        var setsHandle = Meteor.subscribe('cardSets');

        return {
            sets: CardSets.find({}).fetch(),

            setsLoading: !setsHandle.ready()
        }
    },

    changeSetFilter() {
        var setFilter = React.findDOMNode(this.refs.set);

        this.props.onFilterChanged('cardSet._id', setFilter.value.trim());
    },

    changeStatusFilter() {
        var statusFilter = React.findDOMNode(this.refs.status);

        this.props.onFilterChanged('status', statusFilter.value.trim());
    },

    changeSearchFilter() {
        var searchFilter = React.findDOMNode(this.refs.search);

        this.props.onFilterChanged('search', searchFilter.value.trim());
    },

    changeCollectionStatus(newValue) {
        this.props.onFilterChanged('collectionStatus', newValue);
    },

    renderSetSelect() {
        var items = this.data.sets.map((set) => {
            return (
                <option key={set._id} value={set._id}>{set.name}</option>
            );
        });

        return (
            <select ref="set" defaultValue={this.props.filters['cardSet._id']} onChange={this.changeSetFilter}>
                <option value="">Set filter</option>
                {items}
            </select>
        );
    },

    renderStatusSelect() {
        return (
            <select ref="status" defaultValue={this.props.filters.status} onChange={this.changeStatusFilter}>
                <option value="">Status filter</option>
                <option value="Synchronizing">Synchronizing</option>
                <option value="Synchronized">Synchronized</option>
            </select>
        );
    },

    renderSearch() {
        return (
            <input type="text" ref="search" defaultValue={this.props.filters.searchTerm} onChange={this.changeSearchFilter} />
        );
    },

    collectionStatusItems: [
        {
            value: null,
            label: '(All)'
        },

        {
            value: 'owned',
            label: 'Owned'
        },

        {
            value: 'not_owned',
            label: 'Not Owned'
        }
    ],

    render() {
        return (
            <div className="highlighted-block">
                <h3>Filters</h3>

                <div className="basic-filters">
                    <div className="basic-filters-item">
                        <div className="basic-filters-item-name">Sets</div>
                        {this.data.setsLoading ? <LoadingContainer small={true} /> : this.renderSetSelect()}
                    </div>

                    <div className="basic-filters-item">
                        <div className="basic-filters-item-name">Status</div>
                        {this.renderStatusSelect()}
                    </div>

                    <div className="basic-filters-item">
                        <div className="basic-filters-item-name">Search</div>
                        {this.renderSearch()}
                    </div>
                </div>

                <div className="basic-filters">
                    <div className="basic-filters-item">
                        <div className="basic-filters-item-name">Collection status</div>
                        <ToggleButtonList items={this.collectionStatusItems} currentValue={this.props.filters.collectionStatus} onChange={this.changeCollectionStatus} />
                    </div>
                </div>
            </div>
        );
    }

});
