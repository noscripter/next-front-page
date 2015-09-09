import {Promise} from 'es6-promise';
import directly from 'directly';

import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
} from 'graphql';

import {Region} from './types/basic';
import {Collection} from './types/collections';
import {Video} from './types/content';

import sources from './config/sources';

const queryType = new GraphQLObjectType({
	name: 'Query',
	description: 'FT content API',
	fields: {
		top: {
			type: Collection,
			args: {
				region: { type: new GraphQLNonNull(Region) }
			},
			resolve: (root, {region}, {backend}) => {
				let uuid = sources[`${region}Top`].uuid;

				return backend.page(uuid);
			}
		},
		fastFT: {
			type: Collection,
			resolve: (root, _, {backend}) => {
				return backend.fastFT();
			}
		},
		editorsPicks: {
			type: Collection,
			resolve: (root, _, {backend, flags}) => {
				if (flags.editorsPicksFromList) {
					return backend.list(sources['editorsPicks'].uuid);
				} else {
					return [];
				}
			}
		},
		opinion: {
			type: Collection,
			resolve: (root, _, {backend}) => {
				let {uuid, sectionsId} = sources.opinion;

				return backend.page(uuid, sectionsId);
			}
		},
		lifestyle: {
			type: Collection,
			resolve: (root, _, {backend}) => {
				let {uuid, sectionsId} = sources.lifestyle;

				return backend.page(uuid, sectionsId);
			}
		},
		markets: {
			type: Collection,
			resolve: (root, _, {backend}) => {
				let {uuid, sectionsId} = sources.markets;

				return backend.page(uuid, sectionsId);
			}
		},
		technology: {
			type: Collection,
			resolve: (root, _, {backend}) => {
				let {uuid, sectionsId} = sources.technology;

				return backend.page(uuid, sectionsId);
			}
		},
		popular: {
			type: Collection,
			resolve: (root, _, {backend}) => {
				let url = sources.popular.url;

				return backend.popular(url, 'Popular');
			}
		},
		search: {
			type: Collection,
			args: {
				query: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: (_, {query}, {backend}) => {
				return backend.search(query)
					.then(ids => ({ items: ids }));
			}
		},
		videos: {
			type: new GraphQLList(Video),
			resolve: (root, _, {backend}) => {
				let {id} = sources.videos;
				return backend.videos(id);
			}
		}
	}
});

export default new GraphQLSchema({
	query: queryType
});
