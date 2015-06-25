'use strict';

import {pollContent} from '../services/content-api';

const pollConfig = {
	ukTop: {
		type: 'page',
		uuid: '520ddb76-e43d-11e4-9e89-00144feab7de', // list id
		supportsElasticsearch: true,
		interval: 60 * 1000
	},
	intlTop: {
		type: 'page',
		uuid: 'b0d8e4fe-10ff-11e5-8413-00144feabdc0', // list id
		supportsElasticsearch: true,
		interval: 60 * 1000
	},
	fastFt: {
		type: 'concept',
		uuid: '5c7592a8-1f0c-11e4-b0cb-b2227cce2b54', // concept id
		supportsElasticsearch: true,
		interval: 30 * 1000
	}
};

// Content cache for polling
var contentCache = {
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

Object.keys(pollConfig)
.forEach(it => {
	(pollConfig[it].supportsElasticsearch ? ['capi1', 'elastic'] : ['capi1'])
	.forEach(source => {
		pollContent(
			pollConfig[it],
			(source == 'elastic'),
			content => contentCache[source][it] = content
		);
	});
});

// Alias the right region content as "top" to unify the
// data structure for rendering and preprocess the data
// as needed. We may be missing a data presentation layer...
const cachedContent = (topStoriesRegion) => {
	// wish I had built-in currying...
  return (useElasticSearch) => {
		const src = (useElasticSearch ? 'elastic' : 'capi1');
		const top = contentCache[src][topStoriesRegion];

		// limit top items to 10
		if(top.items && top.items.slice) {
			top.items = top.items.slice(0, 10);
		}

		// strip fastFt down to bare minimum
		const fastFt = contentCache[src].fastFt;
		if(fastFt.items && fastFt.items.map) {
			fastFt.items = fastFt.items.map(it => {
				return {id: it.id, title: it.title, publishedDate: it.publishedDate}
			});
		}

		return Object.assign({}, contentCache[src], {top: top, fastFt: fastFt});
	}
}

export default {
	uk: cachedContent('ukTop'),
	intl: cachedContent('ukTop')
}
