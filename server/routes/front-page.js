import content from '../lib/content-graphql';
import {FastFtFeed} from '../../components/fastft/main';
import {Feed} from '../../components/feed/main';

export default (region) => {
	return (req, res) => {
		const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;

		res.set({
			'Cache-Control': 'max-age=40, public, stale-if-error=86400' // 40 seconds; 24 hours
		});

		content.fetch(region, true)
		.then(contentData => {
			console.log(contentData.top.leads[0])

			res.render('uk', {
				layout: 'wrapper',
				FastFtFeed: FastFtFeed,
				Feed: Feed,
				articles: contentData.top,
				fastFT: contentData.fastFT //,
				// opinion: contentData.opinion,
				// tech: contentData.technology,
				// markets: contentData.markets,
				// weekend: contentData.lifestyle,
				// popular: contentData.popular,
				// editors: {
				// 	items: [
				// 		contentData.bigRead.items[0],
				// 		contentData.lunch.items[0],
				// 		contentData.management.items[0],
				// 		contentData.frontPageSkyline.items[0],
				// 		contentData.personInNews.items[0],
				// 		contentData.lex.items[0]
				// 	]
				// }
			});
		})
		.catch(console.log);
	}
};
