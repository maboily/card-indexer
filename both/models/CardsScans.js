CardsScans = new FS.Collection('cards_scans', {
    stores: [new FS.Store.GridFS('cards_scans', {
        chunkSize: 1024 * 1024 * 2
    })]
});

CardsScans.allow({
    download: function() {
        return true;
    }
});
