import content from '../lib/content';
import {FastFtFeed} from '../../components/fastft/main';
import {Feed} from '../../components/feed/main';

/**
*	Fetches the first item that doesn't match the supplied id.
*/
function rejectId(id, contentData) {
	return Object.assign({},
		contentData,
		{ items: contentData.items.filter(item => item.item.id !== id) }
	);
}

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;
	const contentData = content.uk(useElasticSearch);

	let leadArticleId = contentData.top.items[0] && contentData.top.items[0].item.id;

	res.set({
		'Cache-Control': 'max-age=40, public, stale-if-error=86400' // 40 seconds; 24 hours
	});

	res.render('uk', {
		layout: 'wrapper',
		FastFtFeed: FastFtFeed,
		Feed: Feed,
		articles: contentData.top,
		fastFt: contentData.fastFt,
		opinion: rejectId(leadArticleId, contentData.opinion),
		tech: rejectId(leadArticleId, contentData.technology),
		markets: rejectId(leadArticleId, contentData.markets),
		weekend: rejectId(leadArticleId, contentData.lifestyle),
		popular: contentData.popular,
		editors: {
			items: [
				rejectId(leadArticleId, contentData.bigRead).items[0],
				rejectId(leadArticleId, contentData.lunch).items[0],
				rejectId(leadArticleId, contentData.management).items[0],
				rejectId(leadArticleId, contentData.frontPageSkyline).items[0],
				rejectId(leadArticleId, contentData.personInNews).items[0],
				rejectId(leadArticleId, contentData.lex).items[0]
			]
		}
	});
};
