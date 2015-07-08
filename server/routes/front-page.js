import content from '../lib/content';
import {FastFtFeed} from '../../components/fastft/main';
import {Feed} from '../../components/feed/main';

/**
*	Fetches the first item that doesn't match the supplied id.
*/
function fetchFirst(id, items) {
	return items.find(item => {
		return item.item.id !== id;
	});
}

module.exports = function(req, res) {
	const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;
	const contentData = content.uk(useElasticSearch);

	let leadArticle = contentData.top.items[0];

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
				fetchFirst(leadArticle.item.id, contentData.bigRead.items),
				fetchFirst(leadArticle.item.id, contentData.lunch.items),
				fetchFirst(leadArticle.item.id, contentData.management.items),
				fetchFirst(leadArticle.item.id, contentData.frontPageSkyline.items),
				fetchFirst(leadArticle.item.id, contentData.personInNews.items),
				fetchFirst(leadArticle.item.id, contentData.lex.items)
			]
		}
	});
};
