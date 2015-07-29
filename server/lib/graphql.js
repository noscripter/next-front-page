import {graphql} from 'graphql';

import schema from '../graphql/schema';
import backend from '../graphql/backend';
import fastFtFeed from '../graphql/fast-ft-feed';
import mockBackend from '../graphql/mock-backend';

const fetch = (backend, fastFt) => {
	return (query) => {
		const then = new Date().getTime();

		return graphql(schema, query, {
			backend: backend,
			fastFtFeed: fastFt
		})
		.then(it => {
			const now = new Date().getTime();

			console.log("Graphql responded in", now - then, "ms");
			if(it.data) { return it.data; }

			throw it.errors;
		});
	};
};

const fetchEs = fetch(backend(true), fastFtFeed(true));
const fetchCapi = fetch(backend(false), fastFtFeed(false));

const fetchMock = fetch(mockBackend, fastFt(true))

export default (elastic, mock) => ({
	fetch: (mock ? fetchMock : (elastic ? fetchEs : fetchCapi))
});
