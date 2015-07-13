import content from '../lib/content-graphql';

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;

	content.fetch('uk', true)
	.then(data => {
		res.json(data.fastFT);
	});
};
