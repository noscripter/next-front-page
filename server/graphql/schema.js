import {Promise} from 'es6-promise';

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull
} from 'graphql';

import {Region} from './types/basic'
import {Collection} from './types/collections'

import sources from './config/sources';
import backend from './backend';

const queryType = (backend) => {
  return new GraphQLObjectType({
		name: 'Query',
		description: 'FT content API',
		fields: {
			top: {
				type: Collection(backend),
				args: {
					region: { type: new GraphQLNonNull(Region) }
				},
				resolve: (root, {region}) => {
					let uuid = sources[`${region}Top`].uuid;

					return backend.page(uuid);
				}
			},
			fastFT: {
				type: Collection(backend),
				resolve: (root) => {
					let uuid = sources.fastFt.uuid;

					return backend.byConcept(uuid, 'fastFT');
				}
			},
			editorsPicks: {
				type: Collection(backend),
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
								return backend.page(it.uuid)
								.then(page => page.items[0]);
							case 'search':
								return backend.search(it.uuid)
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
			},
			opinion: {
				type: Collection(backend),
				resolve: (root) => {
					let {uuid, sectionsId} = sources.opinion

					return backend.page(uuid, sectionsId);
				}
			},
			lifestyle: {
				type: Collection(backend),
				resolve: (root) => {
					let {uuid, sectionsId} = sources.lifestyle

					return backend.page(uuid, sectionsId);
				}
			},
			markets: {
				type: Collection(backend),
				resolve: (root) => {
					let {uuid, sectionsId} = sources.markets

					return backend.page(uuid, sectionsId);
				}
			},
			technology: {
				type: Collection(backend),
				resolve: (root) => {
					let {uuid, sectionsId} = sources.technology

					return backend.page(uuid, sectionsId);
				}
			},
			popular: {
				type: Collection(backend),
				resolve: (root) => {
					let url = sources.popular.url;

					return backend.popular(url, 'Popular');
				}
			}
		}
	});
}

// Create the two backends to use

const esBackend = backend(true);
const capiBackend = backend(false);

// Define and cache two schemas, one for each

const schemaEs = new GraphQLSchema({
	query: queryType(esBackend)
});

const schemaCapi = new GraphQLSchema({
	query: queryType(capiBackend)
});

export default (elastic) => (elastic ? schemaEs : schemaCapi);
