import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import {
	TopStories,
	FastFT,
	EditorsPicks,
	Opinion,
	Lifestyle,
	Markets,
	Technology,
	Popular
} from './entry-points';

const queryType = new GraphQLObjectType({
	name: 'Query',
	description: 'FT content API',
	fields: () => ({
		top: TopStories,
		fastFT: FastFT,
		editorsPicks: EditorsPicks,
		opinion: Opinion,
		lifestyle: Lifestyle,
		markets: Markets,
		technology: Technology,
		popular: Popular
	})
});

export default new GraphQLSchema({
	query: queryType
});

