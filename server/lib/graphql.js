import {graphql} from 'graphql';
import schema from '../graphql/schema';

const fetch = (elastic) => {
	let sch = schema(elastic);

	return (query) => {
		return graphql(sch, query)
		.then(it => {
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
