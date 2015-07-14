import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import {
	TopStories,
	FastFT,
	EditorsPicks,
	Opinion
} from './entry-points';

const queryType = new GraphQLObjectType({
	name: 'Query',
	description: 'FT content API',
	fields: () => ({
		top: TopStories,
		fastFT: FastFT,
		editorsPicks: EditorsPicks,
		opinion: Opinion
	})
});

export default new GraphQLSchema({
	query: queryType
});

