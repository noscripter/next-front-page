import {Promise} from 'es6-promise';

class Cache {
	constructor(staleTtl) {
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
		const eventualData = fetcher()
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
}

export default Cache;
