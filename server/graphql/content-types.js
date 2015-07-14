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

// Basic types

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

// Collection types

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

// Content types

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
				return `/stream/${concept.taxonomy}Id/${concept.id}`;
			}
		}
	})
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
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		genre: { type: GraphQLString },
		summary: { type: GraphQLString },
		primaryTag: { type: Concept },
		primaryImage: { type: Image },
		lastPublished: { type: GraphQLString },
		relatedContent: {
			type: new GraphQLList(Content),
			args: {
				from: { name: 'from', type: GraphQLInt },
				limit: { name: 'limit', type: GraphQLInt }
			}
		}
	})
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
		},
		relatedContent: {
			type: new GraphQLList(Content),
			args: {
				from: { name: 'from', type: GraphQLInt },
				limit: { name: 'limit', type: GraphQLInt }
			},
			resolve: (content, {from, limit}) => {
				let ids = content.item.package.map(it => it.id);

				return ApiClient.contentLegacy({
					uuid: ids,
					useElasticSearch: true
				}).then(content => {
					content = (from ? content.slice(from) : content);
					content = (limit ? content.slice(0, limit) : content);

					return content;
				})
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
		},
		relatedContent: {
			type: new GraphQLList(Content),
			args: {
				from: { name: 'from', type: GraphQLInt },
				limit: { name: 'limit', type: GraphQLInt }
			},
			resolve: (content, {from, limit}) => {
				let ids = content.item.package.map(it => it.id);

				return ApiClient.content({
					uuid: ids,
					useElasticSearch: true
				}).then(content => {
					content = (from ? content.slice(from) : content);
					content = (limit ? content.slice(0, limit) : content);

					return content;
				})
			}
		}
	})
});

export default {
	Region,
	Collection
}
