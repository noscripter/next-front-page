import ApiClient from 'next-ft-api-client';
import fetch from 'isomorphic-fetch'

import {
  GraphQLNonNull
} from 'graphql';

import {
	Region,
	Page
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
		.then(it => {
			return {
				id: uuid,
				title: it.title,
				items: it.slice()
			}
		});
	}
}

export default {
	TopStories
}
