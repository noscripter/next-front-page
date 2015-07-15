import ApiClient from 'next-ft-api-client';
import fetch from 'isomorphic-fetch';

import articleGenres from 'ft-next-article-genre';

const endpoints = (elasticSearch) => ({
	type: (elasticSearch ? 'elasticsearch' : 'CAPI'),

	page(uuid, sectionsId) {
		return ApiClient.pages({ uuid: uuid })
		.then(it => ({
			id: uuid,
			title: it.title,
			sectionId: sectionsId,
			items: it.slice()
		}));
	},

	byConcept(uuid, title) {
		return ApiClient.contentAnnotatedBy({
			uuid: uuid,
			useElasticSearch: elasticSearch
		})
		.then(ids => ({
			title: title,
			conceptId: uuid,
			sectionId: null,
			items: ids.slice()
		}))
	},

	search(query) {
		return ApiClient.searchLegacy({
			query: query,
			useLegacyContent: true,
			useElasticSearch: elasticSearch
		});
	},

	popular(url, title) {
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
	},

	contentv1(uuids, {from, limit, genres}) {
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
	},

	contentv2(uuids, {from, limit, genres}) {
		return ApiClient.content({
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
});

const esBackend = endpoints(true);
const capiBackend = endpoints(false)

export default (elasticSearch) => (elasticSearch ? esBackend : capiBackend)
