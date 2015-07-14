import {graphql} from 'graphql';
import schema from '../graphql/schema';

const fetch = (query, useElasticSearch) => {
	// const src = (useElasticSearch ? 'elastic' : 'capi1');

	return graphql(schema, query)
	.then(it => {
		if(it.data) { return it.data; }

		throw it.errors;
	});
};

// FIXME change to polling when querying works
export default {
	fetch: fetch,
};
