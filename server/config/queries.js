const fragments = `
	fragment Basic on Content {
		type: __typename
		id
		title
		lastPublished
	}

	fragment Extended on Content {
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
	}

	fragment ExtendedSmallImage on Content {
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
	}

	fragment Related on Content {
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
`;

// Produces a front page query for a given region
const frontPage = (region) => (`
	${fragments}

	query FrontPage {
		top(region: ${region}) {
			leads: items(limit: 1, type: Article) {
				... Basic
				... Extended
				... Related
			}
			liveBlogs: items(type: LiveBlog) {
				... Basic
				... Extended
				... on LiveBlog {
					updates {
						date
						text
					}
				}
			}
			items(from: 1, type: Article) {
				... Basic
				... Extended
				... on LiveBlog {
					updates {
						date
						text
						html
					}
				}
			}
		}
		fastFT {
			items {
				... Basic
			}
		}
		editorsPicks {
			items {
				... Basic
				... ExtendedSmallImage
			}
		}
		opinion {
			url
			items {
				... Basic
				... Extended
			}
		}
		lifestyle {
			url
			items(limit: 2) {
				... Basic
				... Extended
			}
		}
		markets {
			url
			items(limit: 2, genres: ["analysis", "comment"]) {
				... Basic
				... Extended
			}
		}
		technology {
			url
			items(limit: 2, genres: ["analysis", "comment"]) {
				... Basic
				... Extended
			}
		}
		popular {
			items(limit: 10) {
				... Basic
			}
		}
	}`
);

// fastFT query
const fastFT = `
query FastFT {
	fastFT {
		items {
			id
			title
			lastPublished
		}
	}
}`;

export default {
	frontPage,
	fastFT
};
