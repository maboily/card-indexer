CardSetListPage = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('cardSets');

        return {
            cardSets: CardSets.find({}, {sort: {name: 1}}).fetch(),

            cardSetsLoading: !handle.ready()
        }
    },

    getPageHeaderButtons() {
        if (Auth.isAdmin()) {
            return (
                <a href="/sets/new" className="button mod-create"><i
                    className="fa fa-plus fa-lg u-mr-10 u-va-middle"></i>New</a>
            );
        }
    },

    render() {
        return (
            <div>
                <PageHeader title="Sets listing" buttons={this.getPageHeaderButtons()}/>

                <h3>Results</h3>

                {this.data.cardSetsLoading ? <LoadingContainer placeholderHeight={1200} /> : <CardSetList cardSets={this.data.cardSets} />}
            </div>
        );
    }
});
