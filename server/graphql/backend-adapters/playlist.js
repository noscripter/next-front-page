class Playlist {
	constructor(cache) {
		this.cache = cache;
	}

	fetch(uuid, ttl = 50) {
		return this.cache.cached(`video.${uuid}`, ttl, () => {
			return fetch("http://next-video.ft.com/api/playlist/" + encodeURI(uuid))
				.then(res => res.json());
		});
	}
}

export default Playlist;
