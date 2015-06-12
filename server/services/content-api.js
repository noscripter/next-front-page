'use strict';

var errorHandler = require('express-errors-handler');
var Poller = require('ft-poller');
var ApiClient = require('next-ft-api-client');

var ftErrorHandler = (process.env.NODE_ENV === 'production') ? errorHandler.captureMessage : console.log;

var uuid = function(thingUri) {
	return thingUri.replace('http://api.ft.com/thing/', '');
}

var fetchArticles = function(pageId, useElasticSearch) {
	return ApiClient.lists({ uuid: pageId,})
	.then(function(list) {
		var title = list.title;
		var ids = list.items.map(function(it) { return uuid(it.id) });

		return ApiClient.contentLegacy({
			uuid: ids,
			useElasticSearch: useElasticSearch
		}).then(function(articles) {
			return {
				title: title,
				items: articles
			}
		})
	});
}

var logFetched = function(list, useElasticSearch) {
	var source = useElasticSearch ? 'elasticsearch' : 'CAPIv1';
	console.log('Fetched list', list.title, 'with', list.items.length, 'articles from', source);

	return list;
}

var pollList = function(pageId, useElasticSearch, updateContent) {
	var poller = function(data) {
		fetchArticles(pageId, useElasticSearch)
		.then(function(it) { return logFetched(it, useElasticSearch); })
		.then(updateContent)
		.catch(function(err) {
			console.log("Error fetching from", (useElasticSearch ? "elasticsearch" : "CAPIv1"), err);
		});
	};

	poller();
	return setInterval(poller, 5*60*1000);
}

module.exports = {
	pollList: pollList
}
