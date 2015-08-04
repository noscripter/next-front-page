import ApiClient from 'next-ft-api-client';

class CAPI {
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

	page(uuid, ttl = 50) {
		return this.cached(`pages.${uuid}`, ttl, () => {
			return ApiClient.pages({ uuid: uuid })
		});
	}

	byConcept(uuid, ttl = 50) {
		return this.cached(`byconcept.${uuid}`, ttl, () => {
			return ApiClient.contentAnnotatedBy({
				uuid: uuid,
				useElasticSearch: this.elasticSearch
			})
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

	contentv1(uuids) {
		return this.cached(`contentv1.${uuids.join('_')}`, 50, () => {
			return ApiClient.contentLegacy({
				uuid: uuids,
				useElasticSearch: this.elasticSearch
			});
		})
	}

	contentv2(uuids) {
		return this.cached(`contentv2.${uuids.join('_')}`, 50, () => {
			return ApiClient.content({
				uuid: uuids,
				useElasticSearch: this.elasticSearch
			});
		})
	}
}

export default CAPI
