import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import {
	TopStories,
	FastFT,
	Editors,
	Opinion
} from './entry-points';

const queryType = new GraphQLObjectType({
	name: 'Query',
	description: 'FT content API',
	fields: () => ({
		top: TopStories,
		fastFT: FastFT,
		editors: Editors,
		opinion: Opinion
	})
});

export default new GraphQLSchema({
	query: queryType
});

