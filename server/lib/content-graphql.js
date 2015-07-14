import {graphql} from 'graphql';
import {validateDocument} from 'graphql/lib/validator';
import {Source} from 'graphql/lib/language/source';
import {parse} from 'graphql/lib/language/parser';
import schema from '../graphql/schema';

const query = `
query TopQuery {
	top(region: UK) {
		leads: items(limit: 1) {
			id
			title
			genre
			summary
			primaryTag {
				id
				url
				taxonomy
				name
			}
			primaryImage {
				src(width: 710)
				alt
			}
			lastPublished
			relatedContent(limit: 3) {
				id
				title
				genre
				primaryTag {
					id
					url
					taxonomy
					name
				}
			}
		}
		items: items(from: 1) {
			id
			title
			genre
			summary
			primaryTag {
				id
				url
				taxonomy
				name
			}
			primaryImage {
				src(width: 710)
				alt
			}
			lastPublished
		}
	}
	fastFT {
		items {
			id
			title
			lastPublished
		}
	}
	editorsPicks {
		items {
			id
			title
			genre
			summary
			primaryTag {
				id
				url
				taxonomy
				name
			}
			primaryImage {
				src(width: 320)
				alt
			}
			lastPublished
		}
	}
	opinion {
		url
		items {
			id
			title
			genre
			summary
			primaryTag {
				id
				url
				taxonomy
				name
			}
			primaryImage {
				src(width: 710)
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

		throw it.errors;
	});
};

const fetchSchema = () => {
	return graphql(schema, schemaQuery)
	.then(it => it.data);
}

// FIXME change to polling when querying works
export default {
	schema: fetchSchema,
	fetch: fetch,
};
