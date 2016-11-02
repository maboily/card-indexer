StatsFormatter = function(value) {
    return {
        currentValue: value,

        makeValidNumber() {
            if (isNaN(this.currentValue) || this.currentValue == Infinity) {
                this.currentValue = 0;
            }

            return this;
        },

        round(digitsCount) {
            this.currentValue = this.currentValue.toFixed(digitsCount ? digitsCount : 0);

            return this;
        },

        percent() {
            this.currentValue = this.currentValue * 100;

            return this;
        },

        unwrap() {
            return this.currentValue;
        }
    }
}

CollectionStatsParser = class CollectionStatsParser {
    constructor(cardSet, cards, collectionEntries) {
        this.cardSet = cardSet;

        this.cards = this.scopeCards(cards);
        this.collectionEntries = this.scopeCollectionEntries(collectionEntries);
        this.cardsNotOwned = this.getCardsNotOwned(this.cards, this.collectionEntries);
    }

    scopeCards(cards) {
        return cards.filter((card) => {
            return card.cardSet._id == this.cardSet._id;
        });
    }

    scopeCollectionEntries(collectionEntries) {
        return collectionEntries.filter((collectionEntry) => {
            return collectionEntry.card.cardSet._id == this.cardSet._id;
        });
    }

    getCardsNotOwned(cards, collectionEntries) {
        let matchedNotOwnedCards = cards.map((card) => {
            // Finds collection entry
            let matchedCollectionEntries = collectionEntries.filter((collectionEntry) => {
                return collectionEntry.card._id == card._id;
            });

            card.amountOwnedNormal = 0;
            card.amountOwnedRH = 0;

            if (matchedCollectionEntries.length > 0) {
                let matchedCollectionEntry = matchedCollectionEntries[0];

                if (matchedCollectionEntry.amountOwnedNormal) {
                    card.amountOwnedNormal = matchedCollectionEntry.amountOwnedNormal;
                    card.amountOwnedRH = matchedCollectionEntry.amountOwnedRH;
                }
            }

            if (card.amountOwnedNormal == 0 || (card.amountOwnedRH == 0 && card.hasReverseHolo)) {
                return card;
            } else {
                return null; // Undefined values will be filtered out
            }
        });

        return matchedNotOwnedCards.filter((card) => {
            return card != null;
        });
    }

    getStatCardsCompleted(isReverseHolo) {
        const column = isReverseHolo ? 'amountOwnedRH' : 'amountOwnedNormal';

        return this.collectionEntries.filter((collectionEntry) => {
            return collectionEntry[column] > 0;
        }).length;
    }

    getStatCardsCompletedAggregate() {
        return (
            this.getStatCardsCompleted(true) +
            this.getStatCardsCompleted(false)
        );
    }

    getStatCardsCompletedPct(isReverseHolo) {
        const column = isReverseHolo ? 'rhCardsInSet' : 'normalCardsInSet';

        return this.getStatCardsCompleted(isReverseHolo) / this.cardSet[column];
    }

    getStatCardsCompletedPctAggregate() {
        return (
            this.getStatCardsCompletedPct(true) +
            this.getStatCardsCompletedPct(false)
        ) / 2;
    }

    getStatCollectionWorth(isReverseHolo) {
        const column = isReverseHolo ? 'amountOwnedRH' : 'amountOwnedNormal';
        const columnValue = isReverseHolo ? 'valueReverseHolo' : 'value';

        return this.collectionEntries.reduce((lastValue, collectionEntry) => {
            if (!isNaN(collectionEntry.card[columnValue]) && !isNaN(collectionEntry[column]) && collectionEntry[column] != 0) {
                return lastValue + parseFloat(collectionEntry[column]) * parseFloat(collectionEntry.card[columnValue]);
            } else {
                return lastValue;
            }
        }, 0)
    }

    getStatCollectionWorthAggregate() {
        return (
            this.getStatCollectionWorth(true) +
            this.getStatCollectionWorth(false)
        );
    }

    getStatLeftToBuy(isReverseHolo) {
        const column = isReverseHolo ? 'amountOwnedRH' : 'amountOwnedNormal';
        const columnValue = isReverseHolo ? 'valueReverseHolo' : 'value';

        return this.cardsNotOwned.reduce((lastValue, card) => {
            return lastValue + (card[column] == 0 ? card[columnValue] : 0);
        }, 0);
    }

    getStatLeftToBuyAggregate() {
        return (
            this.getStatLeftToBuy(true) +
            this.getStatLeftToBuy(false)
        );
    }

    getFullSummary() {
        return {
            cardsCompleted: {
                normal: StatsFormatter(this.getStatCardsCompleted(false)).makeValidNumber().unwrap(),
                reverseHolo: StatsFormatter(this.getStatCardsCompleted(true)).makeValidNumber().unwrap(),
                total: StatsFormatter(this.getStatCardsCompletedAggregate()).makeValidNumber().unwrap(),

                percent: {
                    normal: StatsFormatter(this.getStatCardsCompletedPct(false)).makeValidNumber().percent().round().unwrap(),
                    reverseHolo: StatsFormatter(this.getStatCardsCompletedPct(true)).makeValidNumber().percent().round().unwrap(),
                    total: StatsFormatter(this.getStatCardsCompletedPctAggregate()).makeValidNumber().percent().round().unwrap()
                }
            },

            worth: {
                normal: StatsFormatter(this.getStatCollectionWorth(false)).makeValidNumber().round(2).unwrap(),
                reverseHolo: StatsFormatter(this.getStatCollectionWorth(true)).makeValidNumber().round(2).unwrap(),
                total: StatsFormatter(this.getStatCollectionWorthAggregate()).makeValidNumber().round(2).unwrap()
            },

            leftToBuy: {
                normal: StatsFormatter(this.getStatLeftToBuy(false)).makeValidNumber().round(2).unwrap(),
                reverseHolo: StatsFormatter(this.getStatLeftToBuy(true)).makeValidNumber().round(2).unwrap(),
                total: StatsFormatter(this.getStatLeftToBuyAggregate()).makeValidNumber().round(2).unwrap()
            }
        };
    }
}
