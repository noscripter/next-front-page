import content from '../lib/content';
import Feed from '../../components/fastft/feed';

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;
	const contentData = content.uk(useElasticSearch);

	console.log(contentData);

	res.render('uk', {
		layout: 'wrapper',
		Feed: Feed,
		articles: contentData.top,
		fastFt: contentData.fastFt,
		opinion: contentData.opinion,
		tech: contentData.technology,
		markets: contentData.markets,
		weekend: contentData.lifestyle
	});
};
