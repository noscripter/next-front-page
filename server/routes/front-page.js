'use strict';

var ContentApi = require('../services/content-api');

var uuids = {
	ukTop: '520ddb76-e43d-11e4-9e89-00144feab7de', // list id
	intlTop: 'b0d8e4fe-10ff-11e5-8413-00144feabdc0', // list id
	fastFt: '5c7592a8-1f0c-11e4-b0cb-b2227cce2b54', // concept id
}

// Content cache for polling
var content = {
	elastic: {
		articles: [],
		fastFt: []
	},
	capi1: {
		articles: [],
		fastFt: []
	}
}

// Poll both APIs so that we can feature flag between them

ContentApi.pollList(uuids.ukTop, true, function(page) {
	content.elastic.articles = page;
});

ContentApi.pollList(uuids.ukTop, false, function(page) {
	content.capi1.articles = page;
});

ContentApi.pollFastFt(uuids.fastFt, true, function(fastFt) {
	content.elastic.fastFt = fastFt;
});

ContentApi.pollFastFt(uuids.fastFt, false, function(fastFt) {
	content.capi1.fastFt = fastFt;
});

module.exports = function(req, res, next) {
	var source = (res.locals.flags.elasticSearchItemGet.isSwitchedOn ? content.elastic : content.capi1);
	if(source.articles.items && source.articles.items.slice) {
		source.articles.items = source.articles.items.slice(0, 10);
	}

	res.render('uk', { layout: 'vanilla', articles: source.articles, fastFt: source.fastFt });
