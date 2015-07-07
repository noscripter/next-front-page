import ApiClient from 'next-ft-api-client';

import articleGenres from 'ft-next-article-genre';
import articlePrimaryTag from 'ft-next-article-primary-tag';

import {
	GraphQLID,
	GraphQLString,
	GraphQLEnumType,
	GraphQLList,
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
})

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

const Content = new GraphQLObjectType({
	name: "Content",
	description: "Content item",
	fields: () => ({
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
		primaryTag: {
			type: GraphQLString,
			resolve: (content) => {
				return articlePrimaryTag(content.item.metadata).name
			}
		}
	})
});

export default {
	Region,
	Page
}
