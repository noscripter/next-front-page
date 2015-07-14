import ApiClient from 'next-ft-api-client';
import fetch from 'isomorphic-fetch';

import articleGenres from 'ft-next-article-genre';

// TODO poll the flags API for the state of this flag
let elasticSearch = true;

const page = (uuid, sectionsId) => {
	return ApiClient.pages({ uuid: uuid })
	.then(it => ({
		id: uuid,
		title: it.title,
		sectionId: sectionsId,
		items: it.slice()
	}));
}

const byConcept = (uuid, title) => {
	return ApiClient.contentAnnotatedBy({ uuid: uuid, useElasticSearch: elasticSearch })
	.then(ids => ({
		title: title,
		conceptId: uuid,
		sectionId: null,
		items: ids.slice()
	}));
}

const search = (query) => {
	return ApiClient.searchLegacy({
		query: query,
		useLegacyContent: true,
		useElasticSearch: elasticSearch
	});
}

const popular = (url, title) => {
	return fetch(url)
	.then((response) => response.json())
	.then((data) => {
		return data.mostRead.pages.map(function (page) {
				var index = page.url.lastIndexOf("/");
				var id = page.url.substr(index + 1).replace('.html', '');
				return id;
		});
	}).then((ids) => ({
		id: null,
		sectionId: null,
		title: title,
		items: ids
	}))
}

const contentv1 = (uuids, {from, limit, genres}) => {
	return ApiClient.contentLegacy({
		uuid: uuids,
		useElasticSearch: elasticSearch
	})
	.then(items => {
		if(genres && genres.length) {
			items = items.filter(it => genres.indexOf(articleGenres(it.item.metadata)) > -1);
		}

		items = (from ? items.slice(from) : items);
		items = (limit ? items.slice(0, limit) : items);

		return items;
	})
}

const contentv2 = (uuids, {from, limit, genres}) => {
	return ApiClient.content({
		uuid: uuids,
		useElasticSearch: true
	})
	.then(items => {
		if(genres && genres.length) {
			items = items.filter(it => genres.indexOf(articleGenres(it.item.metadata)) > -1);
		}

		items = (from ? items.slice(from) : items);
		items = (limit ? items.slice(0, limit) : items);

		return items;
	})
}

export default {
	page,
	byConcept,
	search,
	popular,
	contentv1,
	contentv2
}
