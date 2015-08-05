import {
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLInterfaceType
} from 'graphql';

import {Content, Video} from './content';

const Collection = new GraphQLInterfaceType({
	name: "Collection",
	description: "Set of items of type Content",
	fields: {
		title: { type: GraphQLString },
		url: { type: GraphQLString },
		items: {
			type: new GraphQLList(Content),
			args: {
				from: { type: GraphQLInt },
				limit: { type: GraphQLInt },
				genres: { type: new GraphQLList(GraphQLString) }
			}
		}
	},
	resolveType: (value) => (value.conceptId == null ? Page : ContentByConcept)
});

const VideoCollection = new GraphQLObjectType({
	name: "VideoCollection",
	description: "Collection of videos",
	fields: {
		items: {
			type: new GraphQLList(Video)
		}
	}
});

const Page = new GraphQLObjectType({
	name: "Page",
	description: "Page of content",
	interfaces: [Collection],
	fields: {
		url: {
			type: GraphQLString,
			resolve: (it) => {
				return (it.sectionId ? `/stream/sectionsId/${it.sectionId}` : null);
			}
		},
		title: {
			type: GraphQLString
		},
		items: {
			type: new GraphQLList(Content),
			description: "Content items of the page",
			args: {
				from: { type: GraphQLInt },
				limit: { type: GraphQLInt },
				genres: { type: new GraphQLList(GraphQLString) }
			},
			resolve: (page, {from, limit, genres}, {backend}) => {
				return backend.contentv1(page.items, {from, limit, genres});
			}
		}
	}
});

const ContentByConcept = new GraphQLObjectType({
	name: "ContentByConcept",
	description: "Content annotated by a concept",
	interfaces: [Collection],
	fields: {
		title: {
			type: GraphQLString
		},
		url: {
			type: GraphQLString,
			resolve: () => (null)
		},
		items: {
			type: new GraphQLList(Content),
			description: "Content items",
			args: {
				from: { type: GraphQLInt },
				limit: { type: GraphQLInt },
				genres: { type: new GraphQLList(GraphQLString) }
			},
			resolve: (result, {from, limit, genres}, {backend}) => {
				return backend.contentv2(result.items, {from, limit, genres});
			}
		}
	}
});

export default {
	Collection,
	Page,
	ContentByConcept,
	VideoCollection
};
