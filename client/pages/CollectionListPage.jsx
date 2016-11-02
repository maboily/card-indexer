CollectionListPage = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        var cardsCollectionEntriesHandle = Meteor.subscribe('cardsCollectionEntries');
        var cardSetHandle = Meteor.subscribe('cardSet', this.props.setId);
        var cardsHandle = Meteor.subscribe('cardsInSet', this.props.setId);

        var cardsCollectionEntries = CardCollectionEntry.find().fetch();
        var cardSet = CardSets.findOne({ _id: this.props.setId });
        var cards = Cards.find({ 'cardSet._id': this.props.setId }, { sort: { number: 1}}).fetch();

        // Merge cards with card collection entries
        cards = cards.map((card) => {
            let cardCollectionEntry = cardsCollectionEntries.filter((cardCollectionEntry) => {
                return cardCollectionEntry.card._id == card._id;
            });

            if (cardCollectionEntry.length > 0) {
                cardCollectionEntry = cardCollectionEntry[0];

                card['amountOwnedNormal'] = cardCollectionEntry.amountOwnedNormal;
                card['amountOwnedRH'] = cardCollectionEntry.amountOwnedRH;
            }

            return card;
        });


        return {
            cards: cards,
            cardsLoading: !cardsHandle.ready(),
            cardSet: cardSet,
            cardSetLoading: !cardSetHandle.ready(),
            cardsCollectionEntries: cardsCollectionEntries,
            cardsCollectionEntriesLoading: !cardsCollectionEntriesHandle.ready()
        };
    },

    handleSaveCollection(cardId, amountOwnedNormal, amountOwnedRH) {
        Meteor.call('setCollectionEntry', cardId, amountOwnedNormal, amountOwnedRH);
    },

    render() {
        if (this.data.cardsCollectionEntriesLoading || this.data.cardSetLoading || this.data.cardsLoading) {
            return (
                <LoadingContainer />
            );
        } else {
            return (
                <div>
                    <div className="center-layout">
                        <PageHeader
                            title={`Collection - ${this.data.cardSet.name}`} />
                    </div>

                    <CardScanList
                        cards={this.data.cards}
                        inCollection={true}
                        onCollectionSave={this.handleSaveCollection} />
                </div>
            );
        }
    }
});
