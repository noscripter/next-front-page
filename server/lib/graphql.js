import {graphql} from 'graphql';

import schema from '../graphql/schema';
import backend from '../graphql/backend';
import fastFtFeed from '../graphql/fastFtFeed';

const fetch = (useElasticSearch) => {
	return (query) => {
		const then = new Date().getTime();

		return graphql(schema, query, {
			backend: backend(useElasticSearch),
			fastFtFeed: fastFtFeed(useElasticSearch)
		})
		.then(it => {
			const now = new Date().getTime();

			console.log("Graphql responded in", now - then, "ms");
			if(it.data) { return it.data; }

			throw it.errors;
		});
	};
};

const fetchEs = fetch(true);
const fetchCapi = fetch(false);

export default (elastic) => ({
	fetch: (elastic ? fetchEs : fetchCapi)
});
