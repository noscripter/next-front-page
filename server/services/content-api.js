import ApiClient from 'next-ft-api-client';
import fetch from 'isomorphic-fetch';

function uuid(thingUri) {
	return thingUri.replace('http://api.ft.com/thing/', '');
}

const fetchContent = {
	get(url, useElasticSearch) {
		return fetch(url)
		.then((response) => response.json())
		.then((data) => {
			var ids = data.mostRead.pages.map(function (page) {
					var index = page.url.lastIndexOf("/");
					var id = page.url.substr(index + 1).replace('.html', '');
					return id;
			}).slice(0, 10);

			return ids;
		})
		.then((ids) => {
			return ApiClient.contentLegacy({
				uuid: ids,
				useElasticSearch: useElasticSearch
			}).then(articles => {
				return {
					items: articles
				};
			});
		});
	},

	list(listId, useElasticSearch) {
		return ApiClient.lists({ uuid: listId })
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

	page(pageId, useElasticSearch) {
		return ApiClient.pages({ uuid: pageId })
		.then(ids => {
			return ApiClient.contentLegacy({
				uuid: ids,
				useElasticSearch: useElasticSearch
			}).then(articles => {
				return {
					items: articles
				};
			});
		});
	},

	search(query, useElasticSearch) {
		return ApiClient.searchLegacy({
			query: query,
			useLegacyContent: true,
			useElasticSearch: useElasticSearch
		})
		.then(ids => {
			return ApiClient.contentLegacy({
				uuid: ids,
				useElasticSearch: useElasticSearch
			}).then(articles => {
				return {
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
					items: articles
				};
			});
		});
	}
};

function logFetched(list, useElasticSearch, name) {
	const source = useElasticSearch ? 'elasticsearch' : 'CAPI';
	console.log('Fetched list', list.title || name, 'with', list.items.length, 'articles from', source);

	return list;
}

function pollContent(opt, useElasticSearch, updateContent, name) {
	const fetcher = fetchContent[opt.type];

	const poller = (/*data*/) => {
		fetcher(opt.uuid, useElasticSearch)
		.then(list => logFetched(list, useElasticSearch, name))
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
