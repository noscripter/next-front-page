import ApiClient from 'next-ft-api-client';
import fetch from 'isomorphic-fetch';
import {Promise} from 'es6-promise';

import {
  GraphQLNonNull
} from 'graphql';

import {
	Region,
	Collection,
} from './content-types';

import sources from './config'

const TopStories = {
	type: Collection,
	args: {
		region: { name: 'region', type: new GraphQLNonNull(Region) }
	},
	resolve: (root, {region}) => {
		let uuid = sources[`${region}Top`].uuid;

		return ApiClient.pages({ uuid: uuid })
		.then(it => ({
			id: uuid,
			title: it.title,
			sectionId: null,
			items: it.slice()
		}));
	}
};

const FastFT = {
	type: Collection,
	resolve: (root) => {
		let uuid = sources.fastFt.uuid;

		return ApiClient.contentAnnotatedBy({ uuid: uuid, useElasticSearch: true })
		.then(ids => ({
			title: 'fastFT',
			conceptId: uuid,
			sectionId: null,
			items: ids.slice()
		}))
	}
};

const EditorsPicks = {
	type: Collection,
	resolve: (root) => {
		// HACK this is waiting for editorial to start managing an Editor's picks list
		let config = ['bigRead', 'lunch', 'management', 'frontPageSkyline', 'personInNews', 'lex'];

		let promises = config
		.map((it) => ({
			type: sources[it].type,
			uuid: sources[it].uuid
		}))
		.map((it) => {
			switch(it.type) {
				case 'page':
					return ApiClient.pages({ uuid: it.uuid })
					.then(ids => ids[0]);
				case 'search':
					return ApiClient.searchLegacy({
						query: it.uuid,
						useLegacyContent: true,
						useElasticSearch: true
					})
					.then(ids => ids[0]);
				default:
					throw "Unknown type: " + it.type;
			}
		})

		return Promise.all(promises)
		.then(ids => ({
			title: "Editor's picks",
			conceptId: null,
			sectionId: null,
			items: ids
		}))
	}
};

const Opinion = {
	type: Collection,
	resolve: (root) => {
		let {uuid, sectionsId} = sources.opinion

		return ApiClient.pages({ uuid: uuid })
		.then(it => ({
			id: uuid,
			sectionId: sectionsId,
			title: it.title,
			items: it.slice()
		}))
	}
};

const Lifestyle = {
	type: Collection,
	resolve: (root) => {
		let {uuid, sectionsId} = sources.lifestyle

		return ApiClient.pages({ uuid: uuid })
		.then(it => ({
			id: uuid,
			sectionId: sectionsId,
			title: it.title,
			items: it.slice()
		}))
	}
};

const Markets = {
	type: Collection,
	resolve: (root) => {
		let {uuid, sectionsId} = sources.markets

		return ApiClient.pages({ uuid: uuid })
		.then(it => ({
			id: uuid,
			sectionId: sectionsId,
			title: it.title,
			items: it.slice()
		}))
	}
};

const Technology = {
	type: Collection,
	resolve: (root) => {
		let {uuid, sectionsId} = sources.technology

		return ApiClient.pages({ uuid: uuid })
		.then(it => ({
			id: uuid,
			sectionId: sectionsId,
			title: it.title,
			items: it.slice()
		}))
	}
};

const Popular = {
	type: Collection,
	resolve: (root) => {
		let url = sources.popular.uuid;

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
			title: 'Popular',
			items: ids
		}))
	}
}

export default {
	TopStories,
	FastFT,
	EditorsPicks,
	Opinion,
	Lifestyle,
	Markets,
	Technology,
	Popular
}
