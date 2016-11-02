Meteor.publish('cards', function(queryCards) {
    Auth.requireLoggedIn.bind(this);

    return Cards.find({});
});

Meteor.publish('cardsFiltered', function(options) {
    Auth.requireLoggedIn.bind(this);

    let filters = CardHelper.makeFiltersFromOptions(options),
        sorts = CardHelper.makeSortsFromOptions(options);

    // Return counts + results to client
    Counts.publish(this, 'cardsFilteredCount', Cards.find(filters), {
        noReady: true
    });
    return Cards.find(filters, {
        sort: sorts,
        limit: CardHelper.listLimit,
        skip: parseInt(options.page - 1) * CardHelper.listLimit
    });
});

Meteor.publish('cardsInSet', function(setId) {
    Auth.requireLoggedIn.bind(this);

    if (setId) {
        return Cards.find({
            'cardSet._id': setId
        }, {
            sort: {
                number: 1
            }
        });
    }
});

Meteor.publish('cardById', function(cardId) {
    Auth.requireLoggedIn.bind(this);

    if (cardId) {
        return Cards.find({
            _id: cardId
        }, {
            sort: {
                number: 1
            }
        });
    }
});

Meteor.publish('cardsHeader', function() {
    Auth.requireLoggedIn.bind(this);

    Counts.publish(this, 'cardsHeaderCount', Cards.find(), {
        noReady: true
    });
});

Meteor.publish('cardsQueued', function() {
    Auth.requireLoggedIn.bind(this);

    return Cards.find({
        status: {
            $ne: 'Synchronized'
        }
    }, {
        sort: {
            'cardSet.name': 1,
            number: 1
        }
    });
});
