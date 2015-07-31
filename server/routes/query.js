import graphql from '../lib/graphql';

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;
	const mockBackend = res.locals.flags.mockFrontPage;

	const query = req.body;

	graphql(useElasticSearch, mockBackend).fetch(query)
	.then(data => {
		res.json(data);
	})
	.catch(errors => {
		res.status(400);
		res.json(errors);
	});
};
