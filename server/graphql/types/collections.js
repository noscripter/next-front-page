import ApiClient from 'next-ft-api-client';
import articleGenres from 'ft-next-article-genre';

import {
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLInterfaceType
} from 'graphql';

import {Content} from './content';

const Collection = new GraphQLInterfaceType({
	name: "Collection",
	description: "Set of items of type Content",
	fields: () => ({
		title: { type: GraphQLString },
		url: { type: GraphQLString },
		items: {
			type: new GraphQLList(Content),
			args: {
				from: { name: 'from', type: GraphQLInt },
				limit: { name: 'limit', type: GraphQLInt },
				genres: { name: 'genres', type: new GraphQLList(GraphQLString) }
			}
		}
	}),
	resolveType: (value) => (value.conceptId == null ? Page : ContentByConcept)
});

const Page = new GraphQLObjectType({
	name: "Page",
	description: "Page of content",
	interfaces: [Collection],
	fields: () => ({
		url: {
			type: GraphQLString,
			resolve: (it) => {
				return (it.sectionId ? `/stream/sectionsId/${it.sectionId}` : null)
			}
		},
		title: {
			type: GraphQLString
		},
		items: {
			type: new GraphQLList(Content),
			description: "Content items of the page",
			args: {
				from: { name: 'from', type: GraphQLInt },
				limit: { name: 'limit', type: GraphQLInt },
				genres: { name: 'genres', type: new GraphQLList(GraphQLString) }
			},
			resolve: (page, {from, limit, genres}) => {
				return ApiClient.contentLegacy({
					uuid: page.items,
					useElasticSearch: true
				})
				.then(items => {
					if(genres && genres.length) {
						items = items.filter(it => genres.indexOf(articleGenres(it.item.metadata)) > -1);
					}

					items = (from ? items.slice(from) : items);
					items = (limit ? items.slice(0, limit) : items);

					return items
				})
			}
		}
	})
});

const ContentByConcept = new GraphQLObjectType({
	name: "ContentByConcept",
	description: "Content annotated by a concept",
	interfaces: [Collection],
	fields: () => ({
		title: {
			type: GraphQLString
		},
		url: {
			type: GraphQLString,
			resolve: () => (null),
		},
		items: {
			type: new GraphQLList(Content),
			description: "Content items",
			args: {
				from: { name: 'from', type: GraphQLInt },
				limit: { name: 'limit', type: GraphQLInt },
				genres: {name: 'genres', type: new GraphQLList(GraphQLString) }
			},
			resolve: (result, {from, limit, genres}) => {
				return ApiClient.content({
					uuid: result.items,
					useElasticSearch: true
				})
				.then(items => {
					if(genres && genres.length) {
						items = items.filter(it => genres.indexOf(articleGenres(it.item.metadata)) > -1);
					}

					items = (from ? items.slice(from) : items);
					items = (limit ? items.slice(0, limit) : items);

					return items
				})
			}
		}
	})
});

export default {
	Collection,
	Page,
	ContentByConcept
}
