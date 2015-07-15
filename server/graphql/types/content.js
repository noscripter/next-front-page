import articleGenres from 'ft-next-article-genre';
import articlePrimaryTag from 'ft-next-article-primary-tag';

import {
	GraphQLID,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLObjectType,
	GraphQLInterfaceType,
	GraphQLNonNull
} from 'graphql';

const contentCache = {};
const Content = (backend) => {
	if(contentCache[backend.type]) return contentCache[backend.type];

	contentCache[backend.type] = new GraphQLInterfaceType({
		name: 'Content',
		description: 'A piece of FT content',
		resolveType: (value) => {
			const v1 = ContentV1(backend);
			const v2 = ContentV2(backend);

			return (value.item ? v1 : v2);
		},
		fields: () => ({
			id: { type: GraphQLID },
			title: { type: GraphQLString },
			genre: { type: GraphQLString },
			summary: { type: GraphQLString },
			primaryTag: { type: Concept },
			primaryImage: { type: Image },
			lastPublished: { type: GraphQLString },
			relatedContent: {
				type: new GraphQLList(Content(backend)),
				args: {
					from: { type: GraphQLInt },
					limit: { type: GraphQLInt }
				}
			}
		})
	});

	return contentCache[backend.type];
}

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
				width: { type: new GraphQLNonNull(GraphQLInt) }
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

const contentv1Cache = {};
const ContentV1 = (backend) => {
	if(contentv1Cache[backend.type]) return contentv1Cache[backend.type];

	contentv1Cache[backend.type] = new GraphQLObjectType({
		name: "ContentV1",
		description: "Content item",
	  interfaces: [Content(backend)],
		fields: {
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
				type: new GraphQLList(Content(backend)),
				args: {
					from: { type: GraphQLInt },
					limit: { type: GraphQLInt }
				},
				resolve: (content, {from, limit}) => {
					let ids = content.item.package.map(it => it.id);

					return backend.contentv1(ids, {from, limit});
				}
			}
		}
	});

	return contentv1Cache[backend.type];
}

const contentv2Cache = {};
const ContentV2 = (backend) => {
	if(contentv2Cache[backend.type]) return contentv2Cache[backend.type];

	contentv2Cache[backend.type] = new GraphQLObjectType({
		name: "ContentV2",
		description: "Content item",
		interfaces: [Content(backend)],
		fields: () => ({
			id: {
				type: GraphQLID,
				resolve: (content) => {
					return content.id.replace('http://www.ft.com/thing/', '');
				}
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
				type: new GraphQLList(Content(backend)),
				args: {
					from: { type: GraphQLInt },
					limit: { type: GraphQLInt }
				},
				resolve: (content, {from, limit}) => {
					let ids = content.item.package.map(it => it.id);

					return backend.contentv2(ids, {from, limit});
				}
			}
		})
	});

	return contentv2Cache[backend.type];
}

export default {
	Content,
	Concept,
	Image,
	ContentV1,
	ContentV2
}
