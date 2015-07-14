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
			res.render('uk', {
				layout: 'wrapper',
				FastFtFeed: FastFtFeed,
				Feed: Feed,
				top: contentData.top,
				fastFT: contentData.fastFT,
				editors: contentData.editorsPicks,
				opinion: contentData.opinion,
				lifestyle: contentData.lifestyle,
				markets: contentData.markets,
				technology: contentData.technology
				// popular: contentData.popular,

			});
		})
		.catch(console.log);
	}
};
