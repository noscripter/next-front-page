import ApiClient from 'next-ft-api-client';
import fetch from 'isomorphic-fetch';
import {Promise} from 'es6-promise';

import articleGenres from 'ft-next-article-genre';

const endpoints = (elasticSearch) => ({
	type: (elasticSearch ? 'elasticsearch' : 'capi'),

	// in-memory content storage
	contentCache: {},

	// Caching wrapper. Always returns a promise, when cache expires
	// returns stale data immediately and fetches fresh one
	cached(key, ttl, fetcher) {
		const cache = this.contentCache;

		const data = (cache[key] && cache[key].data);
		const expire = (cache[key] && cache[key].expire);
		const now = (new Date().getTime()) / 1000;

		// we have fresh data
		if(expire > now && data) { return Promise.resolve(data); }

		// fetch fresh data
		const eventualData = fetcher()
		.then((it) => {
			let expire = now + ttl;

			this.contentCache[key] = {
				expire: expire,
				data: it
			}

			return it;
		}.bind(this));

		// return stale data or promise of fresh data
		return (data ? Promise.resolve(data) : eventualData);
	},

	page(uuid, sectionsId) {
		return this.cached(`pages.${uuid}`, 50, () => {
			return ApiClient.pages({ uuid: uuid })
			.then(it => ({
				id: uuid,
				title: it.title,
				sectionId: sectionsId,
				items: it.slice()
			}));
		});
	},

	byConcept(uuid, title) {
		return this.cached(`byconcept.${uuid}`, 50, () => {
			return ApiClient.contentAnnotatedBy({
				uuid: uuid,
				useElasticSearch: elasticSearch
			})
			.then(ids => ({
				title: title,
				conceptId: uuid,
				sectionId: null,
				items: ids.slice()
			}));
		})
	},

	search(query) {
		return this.cached(`search.${query}`, 50, () => {
			return ApiClient.searchLegacy({
				query: query,
				useLegacyContent: true,
				useElasticSearch: elasticSearch
			});
		});
	},

	popular(url, title) {
		return this.cached(`popular.${url}`, 50, () => {
			return fetch(url)
			.then((response) => response.json())
			.then((data) => {
				return data.mostRead.pages.map(function (page) {
						var index = page.url.lastIndexOf("/");
						var id = page.url.substr(index + 1).replace('.html', '');
						return id;
				});
			}).then((ids) => ({
				id: null,
				sectionId: null,
				title: title,
				items: ids
			}));
		});
	},

	contentv1(uuids, {from, limit, genres}) {
		return this.cached(`contentv1.${uuids.join('_')}`, 50, () => {
			return ApiClient.contentLegacy({
				uuid: uuids,
				useElasticSearch: elasticSearch
			})
		})
		.then(items => {
			if(genres && genres.length) {
				items = items.filter(it => genres.indexOf(articleGenres(it.item.metadata)) > -1);
			}

			items = (from ? items.slice(from) : items);
			items = (limit ? items.slice(0, limit) : items);

			return items;
		})
	},

	contentv2(uuids, {from, limit, genres}) {
		return this.cached(`contentv2.${uuids.join('_')}`, 50, () => {
			return ApiClient.content({
				uuid: uuids,
				useElasticSearch: elasticSearch
			})
		})
		.then(items => {
			if(genres && genres.length) {
				items = items.filter(it => genres.indexOf(articleGenres(it.item.metadata)) > -1);
			}

			items = (from ? items.slice(from) : items);
			items = (limit ? items.slice(0, limit) : items);

			return items;
		})
	}
});

const esBackend = endpoints(true);
const capiBackend = endpoints(false);

export default (elasticSearch) => (elasticSearch ? esBackend : capiBackend)
