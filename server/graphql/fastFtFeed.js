import fetch from 'isomorphic-fetch';
import {fastFt as config} from './config/sources.js';
import ApiClient from 'next-ft-api-client';

// Polls for changes on the notification api to determine whether a fetch should
// be made for new content. Hopefully this is a little nicer to the content api
// polling it directly.

class FastFtFeed {
	constructor(elasticSearch) {
		this.elasticSearch = elasticSearch;
		this.type = (elasticSearch ? 'elasticsearch' : 'capi');

		// in-memory content cache
		this.contentCache = {};
		this.since = new Date().toISOString();
		this.fetchFastFt();
		this.pollUpdates();
	}

	fetchFastFt() {
		const {uuid} = config;
		return ApiClient.contentAnnotatedBy({
			uuid: uuid,
			useElasticSearch: this.elasticSearch
		})
		.then(ids => {
			this.contentCache = {
				title: "fastFt",
				conceptId: uuid,
				sectionId: null,
				items: ids.slice()
			};
			return this.contentCache;
		}).catch(console.error);
	}

	pollUpdates() {
		this.poller = setInterval(() => {
			this.hasNewUpdates()
			.then(hasNewUpdates => {
				console.log('Checking for fastFT updates since %s', this.since);
				if(hasNewUpdates) {
					console.log('fastFt updates found. Updating cache...');
					this.fetchFastFt();
					this.since = new Date().toISOString();
				}
			})
			.catch(console.error);
		}, 25 * 1000);
	}
	// Requests a list of notifications for FastFT to determine whether there are
	// any new items.
	hasNewUpdates() {
		const url = `http://api.ft.com/content/notifications?since=${this.since}&apiKey=${process.env.FAST_FT_KEY}`;
		return fetch(url)
			.then(res => res.json())
			.then(json => !!json.notifications.length)
			.catch(console.error);
	}

	fetch() {	return this.contentCache; }
}

// expire old content after 10 minutes
const esBackend = new FastFtFeed(true);
const capiBackend = new FastFtFeed(false);

export default (elasticSearch) => (elasticSearch ? esBackend : capiBackend);
