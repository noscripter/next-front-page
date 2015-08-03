import {GraphQLEnumType} from 'graphql';

const Region = new GraphQLEnumType({
	name: "Region",
	description: "Region with specific content",
	values: {
		UK: {
			value: 'uk',
			description: "United Kingdom"
		},
		US: {
			value: 'us',
			description: "United States of America"
		}
	}
});

const ContentType = new GraphQLEnumType({
	name: "ContentType",
	description: "Story type, e.g. article, live blog, video, infographic, etc.",
	values: {
		Article: {
			value: 'article',
			description: 'Basic article'
		},
		LiveBlog: {
			value: 'liveblog',
			description: 'LiveBlog with updates'
		}
	}
})

export default {
	Region,
	ContentType
};
