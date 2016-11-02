MassAddParser = {
    getCardsListWithState(cardsListString, callback) {
            // Initial check
            if (cardsListString.trim() == '')
                throw 'No data entered';

            // Splits results line by line
            var cardListLines = cardsListString.split('\n');
            var cardsDetails = [];
            var uid = 1;

            for (var cardListLine of cardListLines) {
                // Validate line format
                if (!this.validateLineFormat(cardListLine))
                    throw `Parsing failed: Invalid format for '${cardListLine}'`;

                // Adds new card to collection
                cardsDetails.push({
                    uid: uid++,
                    cardSetId: null,
                    name: MassAddParser.clarifyName(MassAddParser.findName(cardListLine)),
                    number: MassAddParser.findNumber(cardListLine),
                    setCardsCount: MassAddParser.findSetCardsCount(cardListLine),
                    selected: true,
                    hasReverseHolo: MassAddParser.findHasReverseHolo(cardListLine)
                });
            }

            // Finds set for each card, then returns the cards collection
            async.series(cardsDetails.map((card) => {
                return (setCallback) => {
                    Meteor.call('findApparentSet', card, (err, card) => {
                        // Fills in remaining fields
                        card.validated = MassAddParser.validateCard(card);

                        // Replaces card in collection
                        setCallback(null, card);
                    });
                }
            }), (err, cards) => {
                callback(cards);
            });
        },

        findNumber(line) {
            var foundMatches = line.match(/([0-9]{1,})[/][0-9]{1,}/);

            return foundMatches.length >= 2 ? foundMatches[1] : null;
        },

        findSetCardsCount(line) {
            var foundMatches = line.match(/[0-9]{1,}[/]([0-9]{1,})/);

            return foundMatches.length >= 2 ? foundMatches[1] : null;
        },

        findName(line) {
            var foundMatches = line.match(/[\t ]{1,}([^\t]{1,})[\t ]{0,}/);

            return foundMatches.length >= 2 ? foundMatches[1] : null;
        },

        findHasReverseHolo(line) {
            return line.indexOf('Rare Ultra') == -1 &&
                line.indexOf('Rare Secret') == -1 &&
                line.indexOf('Rare Holo ex') == -1 &&
                line.indexOf('EX') == -1;
        },

        validateLineFormat(line) {
            var foundMatches = line.match(/[0-9]{1,}[/][0-9]{1,}[\t ]{1,}[^\t]{1,}[\t ]{0,}/);

            return foundMatches !== null;
        },

        clarifyName(name) {
            // Bulbapedia: Mega and EX always stick to the rest of the name's text, let's fix that
            return name
                .replace('Mega', 'Mega ')
                .replace('EX', ' EX');
        },

        validateCard(card) {
            return (
                (!isNaN(parseInt(card.number))) &&
                (card.name != null && card.name.trim() != '') &&
                (card.cardSetId != null)
            );
        }
};
