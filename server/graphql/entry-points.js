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

import sources from '../config/content'

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

const Editors = {
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

export default {
	TopStories,
	FastFT,
	Editors,
	Opinion
}
