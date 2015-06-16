'use strict';

var errorHandler = require('express-errors-handler');
var ApiClient = require('next-ft-api-client');

var ftErrorHandler = (process.env.NODE_ENV === 'production') ? errorHandler.captureMessage : console.log;

var uuid = function(thingUri) {
	return thingUri.replace('http://api.ft.com/thing/', '');
};

var fetchContent = {
	page: function(pageId, useElasticSearch) {
		return ApiClient.lists({ uuid: pageId })
		.then(function(list) {
			var title = list.title;
			var ids = list.items.map(function(it) { return uuid(it.id); });

			return ApiClient.contentLegacy({
				uuid: ids,
				useElasticSearch: useElasticSearch
			}).then(function(articles) {
				return {
					title: title,
					items: articles
				};
			});
		});
	},

	concept: function(conceptId, useElasticSearch) {
		return ApiClient.contentAnnotatedBy({ uuid: conceptId, useElasticSearch: useElasticSearch })
		.then(function(content) {
			var ids = content;

			return ApiClient.content({
				uuid: ids,
				useElasticSearch: useElasticSearch
			}).then(function(articles) {
				return {
					title: "fastFT",
					items: articles
				};
			});
		});
	}

};

var logFetched = function(list, useElasticSearch) {
	var source = useElasticSearch ? 'elasticsearch' : 'CAPI';
	console.log('Fetched list', list.title, 'with', list.items.length, 'articles from', source);

	return list;
};

var pollContent = function(opt, useElasticSearch, updateContent) {
	var poller = function(/*data*/) {

		fetchContent[opt.type](opt.uuid, useElasticSearch)
		.then(function(it) {
			return logFetched(it, useElasticSearch);
		})
		.then(updateContent)
		.catch(function(err) {
			console.log("Error fetching from", (useElasticSearch ? "elasticsearch" : "CAPI"), err);
		});
	};

	poller();
	return setInterval(
		poller,
		opt.interval
	);
};

module.exports = {
	pollContent: pollContent
};
