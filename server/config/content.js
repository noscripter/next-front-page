'use strict';

const sources = {
	ukTop: {
		type: 'page',
		uuid: '4c499f12-4e94-11de-8d4c-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	usTop: {
		type: 'page',
		uuid: 'b0ed86f4-4e94-11de-8d4c-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	fastFt: {
		type: 'concept',
		uuid: '5c7592a8-1f0c-11e4-b0cb-b2227cce2b54',
		elasticSearchSupported: true,
		interval: 30 * 1000
	},
	opinion: {
		type: 'page',
		sectionsId: "MTE2-U2VjdGlvbnM=",
		uuid: 'ec66fcc8-cd25-11de-a748-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	markets: {
		type: 'page',
		sectionsId: "NzE=-U2VjdGlvbnM=",
		genres: ['analysis', 'comment'],
		uuid: '011debcc-cd26-11de-a748-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	technology: {
		type: 'page',
		sectionsId: "NTM=-U2VjdGlvbnM=",
		genres: ['analysis', 'comment'],
		uuid: 'e900741c-f7e8-11df-8d91-00144feab49a',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	lifestyle: {
		type: 'page',
		sectionsId: "MTQ4-U2VjdGlvbnM=",
		uuid: 'cec106aa-cd25-11de-a748-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	editors: {
		type: 'list',
		uuid: '73667f46-1a55-11e5-a130-2e7db721f996',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	bigRead: {
		type: 'search',
		uuid: 'sections:"The Big Read"',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	lunch: {
		type: 'search',
		uuid: 'brand:"Lunch with the FT"',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	lex: {
		type: 'search',
		uuid: 'sections:"Lex"',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	management: {
		type: 'page',
		uuid: 'fcdae4e8-cd25-11de-a748-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	personInNews: {
		type: 'search',
		uuid: 'brand:"person in the news"',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	frontPageSkyline: {
		type: 'page',
		uuid: '4c499f12-4e94-11de-8d4c-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	popular: {
		type: 'get',
		uuid: 'http://mostpopular.sp.ft-static.com/v1/mostPopular?source=nextArticle',
		elasticSearchSupported: true,
		interval: 60 * 1000
	}
};

export default sources;
