'use strict';
import {pollContent} from '../services/content-api';

const pollConfig = {
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

// Poll both APIs so that we can feature flag between them

Object.keys(pollConfig)
.forEach(it => {
	if(pollConfig[it].useElasticSearch) {
		pollContent(
			pollConfig[it],
			true,
			page => content.elastic[it] = page
		);
	}

	pollContent(
		pollConfig[it],
		false,
		page => content.capi1[it] = page
	);
});

module.exports = function(req, res) {
	var source = (res.locals.flags.elasticSearchItemGet.isSwitchedOn ? content.elastic : content.capi1);
	if(source.ukTop.items && source.ukTop.items.slice) {
		source.ukTop.items = source.ukTop.items.slice(0, 10);
	}

	// strip fastFt down to bare minimum
	const fastFt = source.fastFt;
	if(fastFt.items && fastFt.items.map) {
		fastFt.items = fastFt.items.map(it => {
			return {id: it.id, title: it.title, publishedDate: it.publishedDate}
		});
	}

	res.render('uk', {
		layout: 'wrapper',
		articles: source.ukTop,
		fastFt: fastFt
	});
};
