import {Promise} from 'es6-promise';

import FastFtFeed from './backend-adapters/fast-ft';
import CAPI from './backend-adapters/capi';

import articleGenres from 'ft-next-article-genre';

import sources from './config/sources';

// internal content filtering logic shared for ContentV1 and ContentV2
const filterContent = ({from, limit, genres, type}, resolveType) => {
	return (items) => {
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

		return items;
	}
}

class Backend {
	constructor(adapters, elasticSearch, staleTtl) {
		this.elasticSearch = elasticSearch;
		this.type = (elasticSearch ? 'elasticsearch' : 'capi');
		this.adapters = adapters;

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
		return this.adapters.capi.page(uuid, ttl)
		.then(it => ({
			id: uuid,
			title: it.title,
			sectionId: sectionsId,
			items: it.slice()
		}));
	}

	byConcept(uuid, title, ttl = 50) {
		return this.adapters.capi.contentAnnotatedBy(uuid, ttl)
		.then(ids => ({
			title: title,
			conceptId: uuid,
			sectionId: null,
			items: ids.slice()
		}));
	}

	search(query, ttl = 50) {
		return this.adapters.capi.search(query, ttl)
	}

	contentv1(uuids, opts) {
		return this.adapters.capi.contentv1(uuids)
		.then(filterContent(opts, this.resolveContentType));
	}

	contentv2(uuids, opts) {
		return this.adapters.capi.contentv2(uuids)
		.then(filterContent(opts, this.resolveContentType));
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

	liveblogExtras(uri) {
		const then = new Date();

		return this.cached(`liveblogs.${uri}`, 50, () => {
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
				if((first && first.data.datemodified) < (second && second.data.datemodified)) { json.reverse(); }

				// dedupe updates and only keep messages, decide on status
				let [_, updates, status] = json.reduce(([skip, updates, status], event) => {
					if (event.event == 'end')
						return [skip, updates, 'closed'];

					if (event.event == 'msg' && event.data.mid && !skip[event.data.mid]) {
						updates.push(event);
						skip[event.data.mid] = true;
					}

					return [skip, updates, 'inprogress'];
				}, [{}, [], 'comingsoon']);

				return {updates: updates, status: status};
			})
		});
	}

	fastFT() {
		return this.adapters.fastFT.fetch();
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

const esFastFT = new FastFtFeed(true);
const capiFastFT = new FastFtFeed(false);

const esCAPI = new CAPI(true, 10 * 60);
const directCAPI = new CAPI(false, 10 * 60);

const esBackend = new Backend({fastFT: esFastFT, capi: esCAPI}, true, 10 * 60);
const capiBackend = new Backend({fastFT: capiFastFT, capi: directCAPI},false, 10 * 60);

export default (elasticSearch) => (elasticSearch ? esBackend : capiBackend);
