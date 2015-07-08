import {graphql} from 'graphql';
import {validateDocument} from 'graphql/lib/validator';
import {Source} from 'graphql/lib/language/source';
import {parse} from 'graphql/lib/language/parser';
import schema from '../graphql/schema';

const query = `
query TopQuery {
	top(region: UK) {
		id
		items {
			id
			title
			genre
			summary
			primaryTag
			primaryImage {
				src
				alt
			}
			lastPublished
		}
	}
}`;

const schemaQuery = `
query SchemaQuery {
	__schema {
		types {
			name
		}
	}
}`

const fetch = (topStoriesRegion, useElasticSearch) => {
		// const src = (useElasticSearch ? 'elastic' : 'capi1');

		return graphql(schema, query)
		.then(it => {
			if(it.data) { return it.data; }

			throw it.errors.map(it => it.message).join("\n");
		});
	};
};

const fetchSchema = () => {
	return graphql(schema, schemaQuery)
	.then(it => it.data);
}

// FIXME change to polling when querying works
export default {
	schema: fetchSchema,
	fetch: fetch('uk'),
};
