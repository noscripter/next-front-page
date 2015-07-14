const sources = {
	ukTop: {
		uuid: '4c499f12-4e94-11de-8d4c-00144feabdc0',
		interval: 60 * 1000
	},
	usTop: {
		uuid: 'b0ed86f4-4e94-11de-8d4c-00144feabdc0',
		interval: 60 * 1000
	},
	fastFt: {
		uuid: '5c7592a8-1f0c-11e4-b0cb-b2227cce2b54',
		interval: 30 * 1000
	},
	opinion: {
		sectionsId: "MTE2-U2VjdGlvbnM=",
		uuid: 'ec66fcc8-cd25-11de-a748-00144feabdc0',
		interval: 60 * 1000
	},
	markets: {
		sectionsId: "NzE=-U2VjdGlvbnM=",
		genres: ['analysis', 'comment'],
		uuid: '011debcc-cd26-11de-a748-00144feabdc0',
		interval: 60 * 1000
	},
	technology: {
		sectionsId: "NTM=-U2VjdGlvbnM=",
		genres: ['analysis', 'comment'],
		uuid: 'e900741c-f7e8-11df-8d91-00144feab49a',
		interval: 60 * 1000
	},
	lifestyle: {
		sectionsId: "MTQ4-U2VjdGlvbnM=",
		uuid: 'cec106aa-cd25-11de-a748-00144feabdc0',
		interval: 60 * 1000
	},
	bigRead: {
		type: 'search',
		uuid: 'sections:"The Big Read"',
		interval: 60 * 1000
	},
	lunch: {
		type: 'search',
		uuid: 'brand:"Lunch with the FT"',
		interval: 60 * 1000
	},
	lex: {
		type: 'search',
		uuid: 'brand:"Lex"',
		interval: 60 * 1000
	},
	management: {
		type: 'page',
		uuid: 'fcdae4e8-cd25-11de-a748-00144feabdc0',
		interval: 60 * 1000
	},
	personInNews: {
		type: 'search',
		uuid: 'brand:"Person in the news"',
		interval: 60 * 1000
	},
	frontPageSkyline: {
		type: 'page',
		uuid: '4c499f12-4e94-11de-8d4c-00144feabdc0',
		interval: 60 * 1000
	},
	popular: {
		url: 'http://mostpopular.sp.ft-static.com/v1/mostPopular?source=nextArticle',
		elasticSearchSupported: true,
		interval: 60 * 1000
	}
};

export default sources;
