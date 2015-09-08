import {graphql} from 'graphql';

import schema from '../graphql/schema';
import {factory as backend} from '../graphql/backend';

const fetch = (backend) => {
	return (query) => {
		const then = new Date().getTime();

		return graphql(schema, query, {
			backend: backend
		})
		.then(it => {
			const now = new Date().getTime();

			console.log('Graphql (', backend.type, ') responded in', now - then, 'ms');
			if (it.errors) {
				throw it.errors;
			}
			if(it.data) { return it.data; }
		});
	};
};

const fetchEs = fetch(backend(true));
const fetchCapi = fetch(backend(false));

const fetchMock = fetch(backend(true, true));

export default (elastic, mock) => ({
	fetch: (mock ? fetchMock : (elastic ? fetchEs : fetchCapi))
});
