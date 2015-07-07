import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import {
	TopStories
} from './entry-points';

const queryType = new GraphQLObjectType({
	name: 'Query',
	description: 'FT content API',
	fields: () => ({
		top: TopStories
	})
});

export default new GraphQLSchema({
	query: queryType
});

