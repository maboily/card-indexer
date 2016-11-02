var cheerio = Meteor.npmRequire('cheerio');
var Fiber = Npm.require('fibers');

Meteor.startup(function() {
    Meteor.setTimeout(function() {
        var supervisor = new CrawlerSupervisor();
        supervisor.executionLoop();
    }, 1000);
});

class CrawlerSupervisor {
    constructor() {
        this.nextRunTimestamp = null;
        this.supervisorActive = true;
        this.tntCrawler = new TnTCrawler();
    }

    executionLoop() {
        // Scheduler settings
        while (this.supervisorActive) {
            var settings = SchedulerSettings.findOne();

            if (settings.isActive) {
                // Schedules next run
                if (!this.nextRunTimestamp) {
                    this.scheduleNextRun(settings.runAt);
                }

                // Checks current timestamp
                this.executeScheduledRun();

                // Executes queued tasks
                Cards.find({
                    status: 'Synchronizing'
                }, {
                    timeout: false,
                    sort: {
                        'set.name': 1,
                        number: 1
                    }
                }).forEach(function(queuedCard) {
                    try {
                        this.synchronizeCard(queuedCard);
                        this.logSynchronizationStatus(queuedCard);
                    } catch (ex) {
                        this.logSynchronizationStatus(queuedCard, ex.message);
                    }

                    // HTTP pause for crawled websites
                    Meteor.sleep(1000);
                }.bind(this));
            }

            // Sleep before next run
            Meteor.sleep(5000);
        }
    }

    scheduleNextRun(runTime) {
        if (runTime && runTime.trim() != '') {
            // Parses run time
            var [runTimeMatch, hour, minute] = runTime.match(/([0-9]{2})\:([0-9]{2})/);

            // Creates new timestamp
            this.nextRunTimestamp = parseInt(moment().hours(hour).minutes(minute).seconds(0).add(1, 'days').format('X'));
        }
    }

    executeScheduledRun() {
        var currentTimestamp = parseInt(moment().format('X'));
        if (this.nextRunTimestamp && currentTimestamp > this.nextRunTimestamp) {
            // Updates ALL cards status to synchronizing
            Cards.update({}, {
                $set: {
                    status: 'Synchronizing'
                }
            }, {
                multi: true
            });

            // Schedule next run
            this.scheduleNextRun();
        }
    }

    synchronizeCard(card) {
        var cardDetails = this.fetchCardDetails(card, this.tntCrawler);

        if (cardDetails) {
            Cards.update({
                _id: card._id
            }, {
                $set: {
                    status: 'Updating...'
                }
            });

            async.parallel([
                (callback) => {
                    this.updateCardPrice(card, cardDetails, callback);
                }, (callback) => {
                    this.updateCardScan(card, cardDetails, callback);
                }, (callback) => {
                    this.updateCardScanRH(card, cardDetails, callback);
                }
            ], function() {
                Cards.update({
                    _id: card._id
                }, {
                    $set: {
                        status: 'Synchronized'
                    }
                });
            });
        }
    }

    logSynchronizationStatus(card, error) {
        let message =
            (error) ?
            (`Failed to synchronize card ${card.name} (ID: ${card._id}): ${error}`) :
            (`Successfully synchronized card ${card.name} (ID: ${card._id})`);

        // Logs operation
        SchedulerLog.insert({
            createdAt: new Date(),
            operation: message
        });
    }

    fetchCardDetails(card, crawlerInstance) {
        Cards.update({
            _id: card._id
        }, {
            $set: {
                status: 'Fetching...'
            }
        });

        return crawlerInstance.getCardDetails(card.name, card.number + '/' + card.cardSet.numberCount, card.hasReverseHolo);
    }

    updateCardPrice(card, newDetails, callback) {
        // Normal price
        if (card.value != newDetails.normal.value) {
            Cards.update({
                _id: card._id
            }, {
                $set: {
                    value: newDetails.normal.value
                }
            });

            CardsPriceHistory.insert({
                cardId: card._id,
                value: newDetails.normal.value,
                type: 'Normal',
                createdAt: new Date()
            });
        }

        // Reverse holo price
        if (newDetails.reverseHolo &&
            card.valueReverseHolo != newDetails.reverseHolo.value) {
            Cards.update({
                _id: card._id
            }, {
                $set: {
                    valueReverseHolo: newDetails.reverseHolo.value
                }
            });

            CardsPriceHistory.insert({
                cardId: card._id,
                value: newDetails.reverseHolo.value,
                type: 'Reverse Holo',
                createdAt: new Date()
            });
        }

        callback();
    }

    updateCardScan(card, newDetails, callback) {
        // ToDo: Improve check for scan picture change
        if (card.scanUrlOriginal != newDetails.normal.scanUrl) {
            var insertResult = CardsScans.insert(newDetails.normal.scanUrl);
            var scanObserver = CardsScans.find({
                _id: insertResult._id
            }).observe({
                changed: function(file) {
                    if (file.url() !== null) {
                        // Updates card current price
                        Cards.update({
                            _id: card._id
                        }, {
                            $set: {
                                scanUrl: file.url(),
                                scanUrlOriginal: newDetails.normal.scanUrl
                            }
                        });

                        // Free up resources
                        scanObserver.stop();

                        callback();
                    }
                }
            });
        } else {
            callback();
        }
    }

    updateCardScanRH(card, newDetails, callback) {
        // ToDo: Improve check for scan picture change
        if (newDetails.reverseHolo &&
            card.scanUrlRHOriginal != newDetails.reverseHolo.scanUrl) {
            var insertResult = CardsScans.insert(newDetails.reverseHolo.scanUrl);
            var scanObserver = CardsScans.find({
                _id: insertResult._id
            }).observe({
                changed: function(file) {
                    if (file.url() !== null) {
                        // Updates card current price
                        Cards.update({
                            _id: card._id
                        }, {
                            $set: {
                                scanUrlRH: file.url(),
                                scanUrlRHOriginal: newDetails.reverseHolo.scanUrl
                            }
                        });

                        // Free up resources
                        scanObserver.stop();

                        callback();
                    }
                }
            });
        } else {
            callback();
        }
    }
}

class TnTCrawler {
    constructor() {
        this.baseUrl = 'http://www.trollandtoad.com';
    }

    constructRelativeUrl(path) {
        return this.baseUrl + path;
    }

    targetIsOnline() {
        var homepageResult = Meteor.http.get(this.constructRelativeUrl('/'));

        // Is homepage alive?
        return (homepageResult.statusCode == 200)
    }

    crawlForDetails(cardName, cardNumber) {
        var searchResult = Meteor.http.get(this.constructRelativeUrl(`/products/search.php`), {
            params: {
                search_category: '',
                search_words: `${cardName} ${cardNumber}`,
                searchmode: 'basic'
            }
        });

        if (searchResult.statusCode == 200) {
            var $cheerio = cheerio.load(searchResult.content);

            var priceText = $cheerio('.price_text');
            var resultImage = $cheerio('.search_result_image');

            if (priceText.length > 0 && resultImage.length > 0) {
                // Converts price to float
                var price = priceText.first().text().replace('$', '').trim();
                price = parseFloat(price);

                // Saves scan image to local folder
                return {
                    scanUrl: resultImage.first().attr('src'),
                    value: price
                };
            }
        }

        // Crawl failed
        return null;
    }

    getCardDetails(cardName, cardNumber, hasReverseHolo) {
        if (this.targetIsOnline()) {
            return {
                normal: this.crawlForDetails(cardName, cardNumber),
                reverseHolo: hasReverseHolo ? this.crawlForDetails(cardName + ' reverse holo', cardNumber) : null
            };
        }

        // Price fetch failed
        console.log(`Failed to fetch price for card ${cardName} ${cardNumber}`);
        return null;
    }
}
