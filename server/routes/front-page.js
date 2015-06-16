'use strict';

var ContentApi = require('../services/content-api');

var pollConfig = {
	ukTop: {
		type: 'page',
		uuid: '520ddb76-e43d-11e4-9e89-00144feab7de', // list id
		useElasticSearch: true,
		interval: 60 * 1000
	},
	intlTop: {
		type: 'page',
		uuid: 'b0d8e4fe-10ff-11e5-8413-00144feabdc0', // list id
		useElasticSearch: true,
		interval: 60 * 1000
	},
	fastFt: {
		type: 'concept',
		uuid: '5c7592a8-1f0c-11e4-b0cb-b2227cce2b54', // concept id
		useElasticSearch: true,
		interval: 30 * 1000
	}
};

// Content cache for polling
var content = {
	elastic: {
		ukTop: [],
		intTop: [],
		fastFt: []
	},
	capi1: {
		ukTop: [],
		intTop: [],
		fastFt: []
	}
};

// Poll both APIs so that we can feature flag between them

Object.keys(pollConfig).forEach(function(it) {
	if(pollConfig[it].useElasticSearch) {
		ContentApi.pollContent(pollConfig[it], true, function(page) {
			content.elastic[it] = page;
		});
	}

	ContentApi.pollContent(pollConfig[it], false, function(page) {
		content.capi1[it] = page;
	});
});

module.exports = function(req, res) {
	var source = (res.locals.flags.elasticSearchItemGet.isSwitchedOn ? content.elastic : content.capi1);
	if(source.ukTop.items && source.ukTop.items.slice) {
		source.ukTop.items = source.ukTop.items.slice(0, 10);
	}

	res.render('uk', {
		layout: 'vanilla',
		articles: source.ukTop,
		fastFt: source.fastFt
	});
};
