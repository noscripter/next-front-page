import graphql from '../lib/graphql';
import queries from '../config/queries';

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;

	graphql.fetch(queries.fastFT, true)
	.then(data => {
		res.json(data.fastFT);
	});
};
