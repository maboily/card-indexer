CardListPage = React.createClass({
    propTypes: {
        page: React.PropTypes.number
    },

    mixins: [ReactMeteorData],

    componentWillReceiveProps(nextProps) {
        // Fixes history bug
        this.setState({
            page: nextProps.page ? nextProps.page : 1
        });
    },

    getMeteorData() {
        // Converts sort to an object
        var compiledSorts = { };
        compiledSorts[this.state.currentSortName] = this.state.currentSortIsAscending ? 1 : -1;

        var ownedCardsHandle = Meteor.subscribe('cardsCollectionOwnedIds');

        // Cards collection handle
        let onlyIds = null,
            exceptIds = null;

        if (ownedCardsHandle.ready()) {
            let filteredCardIds = CardsCollectionEntries.find().fetch().map((cardCollectionEntry) => {
                return cardCollectionEntry.card._id;
            });

            if (this.state.filters.collectionStatus == 'owned') {
                onlyIds = filteredCardIds;
            } else if (this.state.filters.collectionStatus == 'not_owned') {
                exceptIds = filteredCardIds;
            }
        }

        let cardsHandleOptions = {
            filters: {
                setId: this.state.filters['cardSet._id'],
                status: this.state.filters.status,
                search: this.state.filters.search,
                onlyIds: onlyIds,
                exceptIds: exceptIds
            },
            page: this.state.page,
            sorts: compiledSorts
        };
        var cardsHandle = Meteor.subscribe('cardsFiltered', cardsHandleOptions);

        var cardsFound = Cards.find(CardHelper.makeFiltersFromOptions(cardsHandleOptions), {sort: CardHelper.makeSortsFromOptions(cardsHandleOptions), limit: CardHelper.listLimit}).fetch();

        return {
            cards: cardsFound,
            cardsLoading: !ownedCardsHandle.ready() && !cardsHandle.ready(),
            count: Counts.get('cardsFilteredCount')
        }
    },

    getInitialState() {
        return {
            filters: {},
            page: this.props.page ? this.props.page : 1,
            reverseHoloView: false,
            currentSortName: 'cardSet.name',
            currentSortIsAscending: true
        }
    },

    handleFilterChanged(filterName, filterValue) {
        var updatedFilters = this.state.filters;

        if (filterValue == '') {
            delete updatedFilters[filterName];
        } else {
            updatedFilters[filterName] = filterValue;
        }

        this.setState({
            filters: updatedFilters
        });
    },

    renderViewButton() {
        if (this.props.scansView) {
            return (
                <a href={'/cards/' + this.state.page} className="button mod-link"><i className="fa fa-table u-mr-10 fa-2x u-va-middle"></i>View as table</a>
            );
        } else {
            return (
                <a href={'/cards/scans/' + this.state.page} className="button mod-link"><i className="fa fa-th u-mr-10 fa-2x u-va-middle"></i>View as scans</a>
            );
        }
    },

    changePage(page) {
        // Change page in router
        if (this.props.scansView) {
            FlowRouter.go(`/cards/scans/${page}`);
        } else {
            FlowRouter.go(`/cards/${page}`);
        }

        // Changes state
        this.setState({
            page: page
        });
    },

    changeSort(sortName, isAscending) {
        this.setState({
            currentSortName: sortName,
            currentSortIsAscending: isAscending
        });
    },

    getPageHeaderButtons() {
        if (Auth.isAdmin()) {
            return [
                (<a key="new" href="/cards/new" className="button mod-create"><i className="fa fa-plus fa-lg u-mr-10 u-va-middle"></i>New</a>),
                (<a key="mass-add" href="/cards/mass-add" className="button mod-act"><i className="fa fa-upload fa-lg u-mr-10 u-va-middle"></i>Add Many</a>)
            ];
        }
    },

    toggleReverseHolo() {
        this.setState({
            reverseHoloView: !this.state.reverseHoloView
        });
    },

    renderRHButton() {
        if (this.props.scansView) {
            if (this.state.reverseHoloView) {
                return (
                    <button type="button" className="button mod-link" onClick={this.toggleReverseHolo}>
                        <i className="fa fa-circle-thin u-mr-10 fa-2x u-va-middle"></i>View standard scans</button>
                );
            } else {
                return (
                    <button type="button" className="button mod-link"
                            onClick={this.toggleReverseHolo}><i
                        className="fa fa-star-o u-mr-10 fa-2x u-va-middle"></i>View reverse holo scans</button>
                );
            }
        }
    },

    renderCardList() {
        if (this.data.cardsLoading) {
            return <LoadingContainer placeholderHeight={1200} />;
        } else {
            if (this.props.scansView) {
                return <CardScanList cards={this.data.cards} reverseHoloView={this.state.reverseHoloView} />
            } else {
                return <CardList cards={this.data.cards} onSort={this.changeSort} currentSortName={this.state.currentSortName} currentSortIsAscending={this.state.currentSortIsAscending} />;
            }
        }
    },

    render() {
        return (
            <div>
                <div className="center-layout">
                    <PageHeader title="Cards listing" buttons={this.getPageHeaderButtons()} />

                    <CardListFilters filters={this.state.filters} onFilterChanged={this.handleFilterChanged} />

                    <h3>Results</h3>

                    {this.renderViewButton()}
                    {this.renderRHButton()}
                </div>

                {this.renderCardList()}

                <div className="center-layout">
                    <Pagination currentPage={this.state.page} elementsPerPage={20}
                                totalElements={this.data.count}
                                onPageChanged={this.changePage}/>
                </div>
            </div>
        );
    }
});
