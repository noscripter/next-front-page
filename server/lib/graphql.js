import {graphql} from 'graphql';
import schema from '../graphql/schema';

const fetch = (elastic) => {
	let sch = schema(elastic);

	return (query) => {
		const then = new Date().getTime();

		return graphql(sch, query)
		.then(it => {
			const now = new Date().getTime();

			console.log("Graphql responded in", now - then, "ms");
			if(it.data) { return it.data; }

			throw it.errors;
		});
	}
};

const fetchEs = fetch(true);
const fetchCapi = fetch(false);

export default (elastic) => ({
	fetch: (elastic ? fetchEs : fetchCapi)
});
