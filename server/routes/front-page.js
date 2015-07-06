import content from '../lib/content';
import FastFtFeed from '../../components/feed/fastFt/main';
import Feed from '../../components/feed/main';

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;
	const contentData = content.uk(useElasticSearch);

	res.render('uk', {
		layout: 'wrapper',
		FastFtFeed: FastFtFeed,
		Feed: Feed,
		articles: contentData.top,
		fastFt: contentData.fastFt,
		opinion: contentData.opinion,
		tech: contentData.technology,
		markets: contentData.markets,
		weekend: contentData.lifestyle,
		popular: contentData.popular,
		editors: {
			items: [
				contentData.bigRead.items[0],
				contentData.lunch.items[0],
				contentData.management.items[0],
				contentData.frontPageSkyline.items[0],
				contentData.personInNews.items[0],
				contentData.lex.items[0]
			]
		}
	});
};
