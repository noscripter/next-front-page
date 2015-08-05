class Liveblog {
	constructor(cache) {
		this.cache = cache;
	}

	fetch(uri, ttl = 50) {
		const then = new Date();

		return this.cache.cached(`liveblogs.${uri}`, 50, () => {
			return fetch(`${uri}?action=catchup&format=json`)
			.then(res => {
				const now = new Date();
				console.log("Fetching live blog took %d ms", now - then);

				return res;
			})
			.then(res => res.json());
		});
	}
}

export default Liveblog;
