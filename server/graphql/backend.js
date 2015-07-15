import ApiClient from 'next-ft-api-client';
import fetch from 'isomorphic-fetch';
import {Promise} from 'es6-promise';

import articleGenres from 'ft-next-article-genre';

class Backend {
	constructor(elasticSearch, staleTtl) {
		this.elasticSearch = elasticSearch;
		this.type = (elasticSearch ? 'elasticsearch' : 'capi');

 		// in-memory content cache
		this.contentCache = {};

		const sweeper = () => {
			const now = (new Date().getTime()) / 1000;

			for(let key in this.contentCache) {
				if(this.contentCache[key].expire + staleTtl < now) {
					delete this.contentCache[key];
				}
			}
		}

		// keep clearing the cache every minute
		setInterval(sweeper, 60*1000);
	}

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
		});

		// return stale data or promise of fresh data
		return (data ? Promise.resolve(data) : eventualData);
	}

	page(uuid, sectionsId, ttl = 50) {
		return this.cached(`pages.${uuid}`, ttl, () => {
			return ApiClient.pages({ uuid: uuid })
			.then(it => ({
				id: uuid,
				title: it.title,
				sectionId: sectionsId,
				items: it.slice()
			}));
		});
	}

	byConcept(uuid, title, ttl = 50) {
		return this.cached(`byconcept.${uuid}`, ttl, () => {
			return ApiClient.contentAnnotatedBy({
				uuid: uuid,
				useElasticSearch: this.elasticSearch
			})
			.then(ids => ({
				title: title,
				conceptId: uuid,
				sectionId: null,
				items: ids.slice()
			}));
		})
	}

	search(query, ttl = 50) {
		return this.cached(`search.${query}`, ttl, () => {
			return ApiClient.searchLegacy({
				query: query,
				useLegacyContent: true,
				useElasticSearch: this.elasticSearch
			});
		});
	}

	popular(url, title, ttl = 50) {
		return this.cached(`popular.${url}`, ttl, () => {
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
	}

	contentv1(uuids, {from, limit, genres}) {
		return this.cached(`contentv1.${uuids.join('_')}`, 50, () => {
			return ApiClient.contentLegacy({
				uuid: uuids,
				useElasticSearch: this.elasticSearch
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

	contentv2(uuids, {from, limit, genres}) {
		return this.cached(`contentv2.${uuids.join('_')}`, 50, () => {
			return ApiClient.content({
				uuid: uuids,
				useElasticSearch: this.elasticSearch
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
}

// expire old content after 10 minutes
const esBackend = new Backend(true, 10 * 60);
const capiBackend = new Backend(false, 10 * 60);

export default (elasticSearch) => (elasticSearch ? esBackend : capiBackend)
