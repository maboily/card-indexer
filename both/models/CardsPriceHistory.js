CardsPriceHistory = new Mongo.Collection('cards_price_history');

CardPriceHistory = Astro.Class({
    name: 'CardPriceHistory',
    collection: CardsPriceHistory,

    fields: {
        cardId: 'string',
        createdAt: {
            type: 'date',
            immutable: true
        },
        value: 'string',
        type: 'string'
    }
});
