import graphql from '../lib/graphql';
import queries from '../config/queries';

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet;
	const mockBackend = res.locals.flags.mockFrontPage;

	res.set({
		'Cache-Control': 'max-age=20, public' // 20 seconds
	});

	graphql(useElasticSearch, mockBackend)
		.fetch(queries.fastFT)
		.then(data => {
			res.json(data.fastFT);
		})
		.catch(console.log);
};
