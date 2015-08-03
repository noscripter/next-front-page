import ApiClient from 'next-ft-api-client';
import {Promise} from 'es6-promise';

import articleGenres from 'ft-next-article-genre';

// internal content filtering logic shared for ContentV1 and ContentV2
const filterContent = ({from, limit, genres, type}, resolveType) => {
	return (items) => {
		console.log("Filtering:", items.map(it => it.id || it.item.id));

		if(genres && genres.length) {
			items = items.filter(it => genres.indexOf(articleGenres(it.item.metadata)) > -1);
		}

		if(type) {
			if(type == 'liveblog')
				items = items.filter(it => resolveType(it) == 'liveblog');
			else
				items = items.filter(it => resolveType(it) != 'liveblog');
		}

		items = (from ? items.slice(from) : items);
		items = (limit ? items.slice(0, limit) : items);

		console.log("Result:", items.map(it => it.id || it.item.id));

		return items;
	}
}

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
		};

		// keep clearing the cache every minute
		setInterval(sweeper, 60 * 1000);
	}

	// Caching wrapper. Always returns a promise, when cache expires
	// returns stale data immediately and fetches fresh one
	cached(key, ttl, fetcher) {
		const cache = this.contentCache;

		const data = (cache[key] && cache[key].data);
		const expire = (cache[key] && cache[key].expire);
		const now = (new Date().getTime()) / 1000;

		// we have fresh data
		if(expire > now && data) { return Promise.resolve(data); }

		// fetch fresh data
		const eventualData = fetcher(data, expire)
		.then((it) => {
			let expireTime = now + ttl;

			this.contentCache[key] = {
				expire: expireTime,
				data: it
			};

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
		});
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

	contentv1(uuids, opts) {
		return this.cached(`contentv1.${uuids.join('_')}`, 50, () => {
			return ApiClient.contentLegacy({
				uuid: uuids,
				useElasticSearch: this.elasticSearch
			});
		})
		.then(filterContent(opts, this.resolveContentType));
	}

	contentv2(uuids, opts) {
		return this.cached(`contentv2.${uuids.join('_')}`, 50, () => {
			return ApiClient.content({
				uuid: uuids,
				useElasticSearch: this.elasticSearch
			});
		})
		.then(filterContent(opts, this.resolveContentType));
	}

	liveblogUpdates(uri) {
		const then = new Date();

		return fetch(`${uri}?action=catchup&format=json`)
		.then(res => {
			const now = new Date();
			console.log("Fetching live blog took %d ms", now - then);

			return res;
		})
		.then(res => res.json())
		.then(json => {
			const dated = json.filter(it => !!it.data.datemodified)
			const [first, second] = dated.slice(0, 2);

			// make sure updates are in order from latest to earliest
			if(first.data.datemodified < second.data.datemodified) { json.reverse(); }

			// dedupe updates and only keep messages
			let [_, updates] = json.reduce(([skip, updates], event) => {
				if (event.data.event == 'msg' && event.data.mid && !skip[event.data.mid]) {
					updates.push(event);
					skip[event.data.mid] = true;
				}
				return [skip, updates];
			}, [{}, []]);

			return updates;
		});
	}

	resolveContentType(value) {
		if (value.item && !!value.item.location.uri.match(/liveblog|marketslive|liveqa/i)) {
			return 'liveblog';
		} else if (value.item) {
			return 'contentv1';
		} else {
			return 'contentv2';
		}
	}
}

// expire old content after 10 minutes
const esBackend = new Backend(true, 10 * 60);
const capiBackend = new Backend(false, 10 * 60);

export default (elasticSearch) => (elasticSearch ? esBackend : capiBackend);
