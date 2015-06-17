import errorHandler from 'express-errors-handler';
import ApiClient from 'next-ft-api-client';
import cheerio from 'cheerio';

const ftErrorHandler = (process.env.NODE_ENV === 'production') ? errorHandler.captureMessage : console.log;

function uuid(thingUri) {
	return thingUri.replace('http://api.ft.com/thing/', '');
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
			return ApiClient.content({
				uuid: ids,
				useElasticSearch: useElasticSearch
			}).then(articles => {
				return {
					items: articles.map(it => {
						it.summary = cheerio.load(it.bodyXML)('body p:first-child').html();
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
	const poller = (/*data*/) => {
		fetchContent[opt.type](opt.uuid, useElasticSearch)
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
