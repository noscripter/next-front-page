import graphql from '../lib/graphql';
import queries from '../config/queries';

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;

	graphql(useElasticSearch).fetch(queries.fastFT)
	.then(data => {
		res.json(data.fastFT);
	})
	.catch(console.log);
};
