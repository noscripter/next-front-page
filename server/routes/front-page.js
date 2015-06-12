'use strict';

var ContentApi = require('../services/content-api');

var uuids = {
	ukTop: '520ddb76-e43d-11e4-9e89-00144feab7de',
	intlTop: 'b0d8e4fe-10ff-11e5-8413-00144feabdc0'
}

var content = {
	elastic: [],
	capi1: []
}

// Poll both APIs so that we can feature flag between them

ContentApi.pollList(uuids.ukTop, true, function(page) {
	content.elastic = page;
});

ContentApi.pollList(uuids.ukTop, false, function(page) {
	content.capi1 = page;
});

module.exports = function(req, res, next) {
	var articles = res.locals.flags.elasticSearchItemGet.isSwitchedOn ? content.elastic : content.capi1;
	res.render('uk', { layout: 'vanilla', articles: articles });
