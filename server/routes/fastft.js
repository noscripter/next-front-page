'use strict';

// import content from '../lib/content';

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;
	// const contentData = content.uk(useElasticSearch);

	// res.json(contentData.fastFt);
	res.json({});
};
