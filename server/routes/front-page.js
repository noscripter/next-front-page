import graphql from '../lib/graphql';
import queries from '../config/queries';

import {FastFtFeed} from '../../components/fastft/main';
import {Feed} from '../../components/feed/main';

export default (region) => {
	return (req, res) => {
		const useElasticSearch = res.locals.flags.elasticSearchItemGet;
		const mockBackend = res.locals.flags.mockFrontPage;

		console.log(useElasticSearch, mockBackend);

		res.set({
			'Cache-Control': 'max-age=40, public, stale-if-error=86400' // 40 seconds; 24 hours
		});

		graphql(useElasticSearch, mockBackend).fetch(queries.frontPage(region))
		.then(contentData => {
			res.render('uk', {
				layout: 'wrapper',
				FastFtFeed: FastFtFeed,
				Feed: Feed,
				content: contentData
			});
		})
		.catch(it => {
			console.log(it);
		});
	}
};
