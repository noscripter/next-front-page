import {graphql} from 'graphql';

import schema from '../graphql/schema';
import backend from '../graphql/backend';
import mockBackend from '../graphql/mock-backend';

const fetch = (backend) => {
	return (query) => {
		const then = new Date().getTime();

		return graphql(schema, query, {
			backend: backend
		})
		.then(it => {
			const now = new Date().getTime();

			console.log("Graphql responded in", now - then, "ms");
			if(it.data) { return it.data; }

			throw it.errors;
		});
	};
};

const fetchEs = fetch(backend(true));
const fetchCapi = fetch(backend(false));

const fetchMock = fetch(mockBackend);

export default (elastic, mock) => ({
	fetch: (mock ? fetchMock : (elastic ? fetchEs : fetchCapi))
});
