import {pollContent} from '../services/content-api';
import {default as pollConfig} from '../config/content.js';

import articleGenres from 'ft-next-article-genre';
import {default as articlePrimaryTag} from 'ft-next-article-primary-tag';


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
				let fetchedContent = content;

				fetchedContent = content;
				fetchedContent.url = `/stream/sectionsId/${pollConfig[it].sectionsId}`;
				fetchedContent.items = content.items.map(story => {
					return Object.assign({}, story, {
						viewGenre: articleGenres(story.item.metadata),
						primaryTag: articlePrimaryTag(story.item.metadata)
					});
				});

				if (pollConfig[it].genres) {
					fetchedContent.items = content.items.filter(story => {
						const genre = story.item.metadata.genre[0].term.name.toLowerCase();
						return pollConfig[it].genres.indexOf(genre) > -1;
					});
				}

				contentCache[source][it] = fetchedContent;
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

		// strip fastFt down to bare minimum
		const fastFt = contentCache[src].fastFt;
		if(fastFt.items && fastFt.items.map) {
			fastFt.items = fastFt.items.map(it => {
				return {id: it.id, title: it.title, publishedDate: it.publishedDate};
			});
		}

		return Object.assign({}, contentCache[src], {top: top, fastFt: fastFt});
	};
};

export default {
	uk: cachedContent('ukTop'),
	us: cachedContent('usTop')
};
