import ApiClient from 'next-ft-api-client';

function uuid(thingUri) {
	return thingUri.replace('http://api.ft.com/thing/', '');
}

const fetchContent = {
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
	const fetch = fetchContent[opt.type];

	const poller = (/*data*/) => {
		fetch(opt.uuid, useElasticSearch)
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
