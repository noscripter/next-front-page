import ApiClient from 'next-ft-api-client';
import fetch from 'isomorphic-fetch'

import {
  GraphQLNonNull
} from 'graphql';

import {
	Region,
	Page,
	ContentByConcept
} from './content-types';

import sources from '../config/content'

const TopStories = {
	type: Page,
	args: {
		region: { name: 'region', type: new GraphQLNonNull(Region) }
	},
	resolve: (root, {region}) => {
		let uuid = sources[`${region}Top`].uuid;

		return ApiClient.pages({ uuid: uuid })
		.then(it => ({
			id: uuid,
			title: it.title,
			items: it.slice()
		}));
	}
};

const FastFT = {
	type: ContentByConcept,
	resolve: (root) => {
		let uuid = sources.fastFt.uuid;

		return ApiClient.contentAnnotatedBy({ uuid: uuid, useElasticSearch: true })
		.then(ids => ({
			conceptId: uuid,
			title: 'fastFT',
			items: ids.slice()
		}));
	}
}

export default {
	TopStories,
	FastFT
}
