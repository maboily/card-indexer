db.card_sets.find({}).forEach(function (cardSet) {
    cardSet.normalCardsInSet = db.cards.find({ 'cardSet._id': cardSet._id }).count();
    cardSet.rhCardsInSet = db.cards.find({ 'cardSet._id': cardSet._id, hasReverseHolo: true}).count();

    db.card_sets.save(cardSet);
});
