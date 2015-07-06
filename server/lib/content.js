import {pollContent} from '../services/content-api';
import {default as pollConfig} from '../config/content.js';

const empty = { items: [] };

// Content cache for polling
var contentCache = {
	elastic: {
		ukTop: empty,
		fastFt: empty,
		opinion: empty,
		markets: empty,
		technology: empty,
		lifestyle: empty,
		editors: empty,
		bigRead: empty,
		lunch: empty,
		management: empty,
		frontPageSkyline: empty,
		personInNews: empty,
		popular: empty,
		lex: empty
	},
	capi1: {
		ukTop: empty,
		fastFt: empty,
		opinion: empty,
		markets: empty,
		technology: empty,
		lifestyle: empty,
		editors: empty,
		bigRead: empty,
		lunch: empty,
		management: empty,
		frontPageSkyline: empty,
		personInNews: empty,
		popular: empty,
		lex: empty
	}
};

// Poll both APIs so that we can feature flag between them

Object.keys(pollConfig)
.forEach(it => {
	(pollConfig[it].supportsElasticsearch ? ['capi1', 'elastic'] : ['capi1'])
	.forEach(source => {
		pollContent(
			pollConfig[it],
			(source === 'elastic'),
			content => {
				contentCache[source][it] = content;
				contentCache[source][it].url = `/stream/sectionsId/${pollConfig[it].sectionsId}`;
				if (pollConfig[it].genres) {
					contentCache[source][it].items = content.items.filter(story => {
						const genre = story.item.metadata.genre[0].term.name.toLowerCase();
						return ~pollConfig[it].genres.indexOf(genre);
					});
				}
			},
			it
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

		// strip feeds down to bare minimum
		const feeds = ['fastFt', 'popular']
		.reduce((obj, feed) => {
			let feedContent = contentCache[src][feed];
			if(feedContent.items && feedContent.items.map) {
				let result = feedContent.items.map(it => {
					return {
						id: it.item.id,
						title: it.item.title,
						publishedDate: it.item.publishedDate || it.item.lifecycle.lastPublishDateTime
					};
				});
				obj[feed] = {items: result};
			return obj;
			}
		}, {});

		return Object.assign({}, contentCache[src], {top: top}, feeds);
	};
};

export default {
	uk: cachedContent('ukTop'),
	us: cachedContent('usTop')
};
