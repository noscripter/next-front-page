const fragments = `
	fragment Basic on Content {
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
const frontPage = (region) => {
	return `
		${fragments}

		query FrontPage {
			top(region: ${region}) {
				leads: items(limit: 1) {
					... Basic
					... Extended
					... Related
				}
				items(from: 1) {
					... Basic
					... Extended
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
			video {
        items {
            id
						title
						description
						lastPublished
            image {
              src(width: 320)
							alt
            }
        }
			}
		}
	`;
};

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
	}
`;

export default {
	frontPage,
	fastFT
};
