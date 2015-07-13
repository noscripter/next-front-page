import ApiClient from 'next-ft-api-client';

import articleGenres from 'ft-next-article-genre';
import articlePrimaryTag from 'ft-next-article-primary-tag';

import {
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLEnumType,
	GraphQLScalarType,
	GraphQLObjectType,
	GraphQLInterfaceType,
	GraphQLNonNull
} from 'graphql';

const Region = new GraphQLEnumType({
	name: "Region",
	description: "Region with specific content",
	values: {
		UK: {
			value: 'uk',
			description: "United Kingdom"
		},
		US: {
			value: 'us',
			description: "United States of America"
		}
	}
});

const Image = new GraphQLObjectType({
	name: "Image",
	description: "An image",
	fields: () => ({
		src: {
			type: GraphQLString,
			description: "Source URL of the image",
			args: {
				width: { name: 'width', type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve: (it, {width}) => {
				return `//next-geebee.ft.com/image/v1/images/raw/${it.url}?source=next&fit=scale-down&width=${width}`
			}
		},
		alt: {
			type: GraphQLString,
			description: "Alternative text"
		}
	})
});

const Concept = new GraphQLObjectType({
	name: "Concept",
	description: "Metadata tag describing a person/region/brand/...",
	fields: () => ({
		id: {
			type: GraphQLID,
			description: 'Concept id'
		},
		taxonomy: {
			type: GraphQLString,
			description: 'Type of the concept',
		},
		name: {
			type: GraphQLString,
			description: 'Name of the concept'
		},
		url: {
			type: GraphQLString,
			description: 'Stream URL for the concept',
			resolve: (concept) => {
				return `/stream/${concept.taxonomy}Id/{{concept.id}}`;
			}
		}
	})
});

// Main content types

const Page = new GraphQLObjectType({
	name: "Page",
	description: "Page of content",
	fields: () => ({
		id: {
			type: GraphQLID
		},
		items: {
			type: new GraphQLList(Content),
			description: "Content items of the page",
			resolve: (page) => {
				return ApiClient.contentLegacy({
					uuid: page.items,
					useElasticSearch: true
				})
			}
		}
	})
});

const ContentByConcept = new GraphQLObjectType({
	name: "ContentByConcept",
	description: "Content annotated by a concept",
	fields: () => ({
		conceptId: {
			type: GraphQLID
		},
		title: {
			type: GraphQLString
		},
		items: {
			type: new GraphQLList(Content),
			description: "Content items",
			resolve: (result) => {
				return ApiClient.content({
					uuid: result.items,
					useElasticSearch: true
				})
			}
		}
	})
});

const ImageTypePriority = [
	'wide-format',
	'article',
	'leader',
	'primary',
	'secondary'
];

const Content = new GraphQLInterfaceType({
	name: 'Content',
	description: 'Content item (either v1 or v2)',
	resolveType: (value) => (value.item ? ContentV1 : ContentV2),
	fields: {
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		genre: { type: GraphQLString },
		summary: { type: GraphQLString },
		primaryTag: { type: Concept },
		primaryImage: { type: Image },
		lastPublished: { type: GraphQLString }
	}
});

const ContentV1 = new GraphQLObjectType({
	name: "ContentV1",
	description: "Content item",
  interfaces: [Content],
	fields: () => ({
		id: {
			type: GraphQLID,
			resolve: (content) => content.item.id
		},
		title: {
			type: GraphQLString,
			resolve: (content) => {
				return content.item.title.title;
			}
		},
		genre: {
			type: GraphQLString,
			resolve: (content) => articleGenres(content.item.metadata)
		},
		summary: {
			type: GraphQLString,
			resolve: (content) => content.item.summary.excerpt
		},
		primaryTag: {
			type: Concept,
			resolve: (content) => {
				return articlePrimaryTag(content.item.metadata)
			}
		},
		primaryImage: {
			type: Image,
			resolve: (content) => {
				let imageMap = content.item.images.reduce((map, it) => {
					return Object.assign({[it.type]: it}, map);
				}, {});
				let type = ImageTypePriority.find(it => !!imageMap[it]);

				return imageMap[type];
			}
		},
		lastPublished: {
			type: GraphQLString,
			resolve: (content) => {
				return content.item.lifecycle.lastPublishDateTime;
			}
		}
	})
});

const ContentV2 = new GraphQLObjectType({
	name: "ContentV2",
	description: "Content item",
	interfaces: [Content],
	fields: () => ({
		id: {
			type: GraphQLID,
			resolve: (content) => content.id.replace('http://www.ft.com/thing/', '')
		},
		title: {
			type: GraphQLString,
		},
		genre: {
			type: GraphQLString,
			resolve: (content) => articleGenres(content.item.metadata)
		},
		summary: {
			type: GraphQLString,
			resolve: (content) => content.item.summary.excerpt
		},
		primaryTag: {
			type: Concept,
			resolve: (content) => {
				return articlePrimaryTag(content.item.metadata)
			}
		},
		primaryImage: {
			type: Image,
			resolve: (content) => {
				let imageMap = content.item.images.reduce((map, it) => {
					return Object.assign({[it.type]: it}, map);
				}, {});
				let type = ImageTypePriority.find(it => !!imageMap[it]);

				return imageMap[type];
			}
		},
		lastPublished: {
			type: GraphQLString,
			resolve: (content) => {
				return content.publishedDate;
			}
		}
	})
});


export default {
	Region,
	Page,
	ContentByConcept
}
