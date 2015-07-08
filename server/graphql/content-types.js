import ApiClient from 'next-ft-api-client';

import articleGenres from 'ft-next-article-genre';
import articlePrimaryTag from 'ft-next-article-primary-tag';

import {
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLEnumType,
	GraphQLScalarType,
	GraphQLObjectType
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
			resolve: (it) => it.url
		},
		alt: {
			type: GraphQLString,
			description: "Alternative text",
			resolve: (it) => it.alt
		}
	})
});

// Main content types

const Page = new GraphQLObjectType({
	name: "Page",
	description: "Page of content",
	fields: () => ({
		id: {
			type: GraphQLID,
			resolve: (page) => {
				return page.id;
			}
		},
		items: {
			type: new GraphQLList(Content),
			description: "Content items of the page",
			resolve: (page) => {
				return ApiClient.contentLegacy({
					uuid: page.items,
					useElasticSearch: true
				})
				.then(articles => {
					return articles;
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

const Content = new GraphQLObjectType({
	name: "Content",
	description: "Content item",
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
			type: GraphQLString,
			resolve: (content) => {
				return articlePrimaryTag(content.item.metadata).name
			}
		},
		primaryImage: {
			type: Image,
			resolve: (content) => {
				console.log("Image:", content.item.images);
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

export default {
	Region,
	Page
}
