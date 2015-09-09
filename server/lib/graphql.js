import {graphql} from 'graphql';

import schema from '../graphql/schema';
import {factory as backend} from '../graphql/backend';

const fetch = (backend, opts = {}) => {
	return (query) => {
		const then = new Date().getTime();

		return graphql(schema, query, Object.assign(opts, {
			backend: backend
		}))
		.then(it => {
			const now = new Date().getTime();

			console.log('Graphql (', backend.type, ') responded in', now - then, 'ms');
			if(it.data) { return it.data; }

			throw it.errors;
		});
	};
};

export default (elastic, mock, opts = {}) => {
	var fetchEs = fetch(backend(true), opts);
	var fetchCapi = fetch(backend(false), opts);

	var fetchMock = fetch(backend(true, true), opts);

	return {
		fetch: (mock ? fetchMock : (elastic ? fetchEs : fetchCapi))
	}
};
