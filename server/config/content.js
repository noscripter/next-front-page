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
		uuid: 'ec66fcc8-cd25-11de-a748-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	markets: {
		type: 'page',
		genres: ['analysis', 'comment'],
		uuid: '011debcc-cd26-11de-a748-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	technology: {
		type: 'page',
		genres: ['analysis', 'comment'],
		uuid: 'e900741c-f7e8-11df-8d91-00144feab49a',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	lifestyle: {
		type: 'page',
		uuid: 'cec106aa-cd25-11de-a748-00144feabdc0',
		elasticSearchSupported: true,
		interval: 60 * 1000
	},
	editors: {
		type: 'list',
		uuid: '73667f46-1a55-11e5-a130-2e7db721f996',
		elasticSearchSupported: true,
		interval: 60 * 1000
	}
}

export default sources;
