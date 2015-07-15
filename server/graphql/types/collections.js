import {
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLInterfaceType
} from 'graphql';

import {Content} from './content';

const collectionCache = {};
const Collection = (backend) => {
	if(collectionCache[backend.type]) return collectionCache[backend.type];

	collectionCache[backend.type] = new GraphQLInterfaceType({
		name: "Collection",
		description: "Set of items of type Content",
		fields: {
			title: { type: GraphQLString },
			url: { type: GraphQLString },
			items: {
				type: new GraphQLList(Content(backend)),
				args: {
					from: { type: GraphQLInt },
					limit: { type: GraphQLInt },
					genres: { type: new GraphQLList(GraphQLString) }
				}
			}
		},
		resolveType: (value) => {
			const page = Page(backend);
			const cbc = ContentByConcept(backend);

			return (value.conceptId == null ? page : cbc);
		}
	});

	return collectionCache[backend.type];
}

const pageCache = {};
const Page = (backend) => {
	if(pageCache[backend.type]) return pageCache[backend.type];

	pageCache[backend.type] = new GraphQLObjectType({
		name: "Page",
		description: "Page of content",
		interfaces: [Collection(backend)],
		fields: {
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
				type: new GraphQLList(Content(backend)),
				description: "Content items of the page",
				args: {
					from: { type: GraphQLInt },
					limit: { type: GraphQLInt },
					genres: { type: new GraphQLList(GraphQLString) }
				},
				resolve: (page, {from, limit, genres}) => {
					return backend.contentv1(page.items, {from, limit, genres});
				}
			}
		}
	});

	return pageCache[backend.type];
}

const contentByConceptCache = {};
const ContentByConcept = (backend) => {
	if(contentByConceptCache[backend.type]) return contentByConceptCache[backend.type];

	contentByConceptCache[backend.type] = new GraphQLObjectType({
		name: "ContentByConcept",
		description: "Content annotated by a concept",
		interfaces: [Collection(backend)],
		fields: {
			title: {
				type: GraphQLString
			},
			url: {
				type: GraphQLString,
				resolve: () => (null),
			},
			items: {
				type: new GraphQLList(Content(backend)),
				description: "Content items",
				args: {
					from: { type: GraphQLInt },
					limit: { type: GraphQLInt },
					genres: { type: new GraphQLList(GraphQLString) }
				},
				resolve: (result, {from, limit, genres}) => {
					return backend.contentv2(result.items, {from, limit, genres})
				}
			}
		}
	});

	return contentByConceptCache[backend.type];
}

export default {
	Collection,
	Page,
	ContentByConcept
}
