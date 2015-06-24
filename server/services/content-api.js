'use strict';

import ApiClient from 'next-ft-api-client';
import cheerio from 'cheerio';

function uuid(thingUri) {
	return thingUri.replace('http://api.ft.com/thing/', '');
}

function firstParagraph(html) {
	cheerio.load(html)('body p:first-child').html()
}

const fetchContent = {
	page(pageId, useElasticSearch) {
		return ApiClient.lists({ uuid: pageId })
		.then(list => {
			var title = list.title;
			var ids = list.items.map(it => uuid(it.id));

			return ApiClient.contentLegacy({
				uuid: ids,
				useElasticSearch: useElasticSearch
			}).then(articles => {
				return {
					title: title,
					items: articles
				};
			});
		});
	},

	concept(conceptId, useElasticSearch) {
		return ApiClient.contentAnnotatedBy({ uuid: conceptId, useElasticSearch: useElasticSearch })
		.then(ids => {
			return ApiClient.content({ uuid: ids, useElasticSearch: useElasticSearch})
			.then(articles => {
				return {
					items: articles.map(it => {
						it.summary = firstParagraph(it.bodyXML);
						return it;
					})
				};
			});
		});
	}
};

function logFetched(list, useElasticSearch) {
	const source = useElasticSearch ? 'elasticsearch' : 'CAPI';
	console.log('Fetched list', list.title, 'with', list.items.length, 'articles from', source);

	return list;
}

function pollContent(opt, useElasticSearch, updateContent) {
	const fetch = fetchContent[opt.type];

	const poller = (/*data*/) => {
		fetch(opt.uuid, useElasticSearch)
		.then(it => logFetched(it, useElasticSearch))
		.then(updateContent)
		.catch(err => {
			console.log('Error fetching from', (useElasticSearch ? 'elasticsearch' : 'CAPI'), err);
		});
	};

	poller();
	return setInterval(
		poller,
		opt.interval
	);
}

export default {
	pollContent: pollContent
};
