import graphql from '../lib/graphql';
import queries from '../config/queries';

import {FastFtFeed} from '../../components/fastft/main';
import {Feed} from '../../components/feed/main';

export default (region) => {
	return (req, res) => {
		const useElasticSearch = res.locals.flags.elasticSearchItemGet.isSwitchedOn;

		res.set({
			// needs to be private so we can vary for signed in state, ab tests, etc
			'Cache-Control': 'max-age=0, private, no-cache'
		});

		graphql(useElasticSearch).fetch(queries.frontPage(region))
		.then(contentData => {
			res.render('uk', {
				layout: 'wrapper',
				FastFtFeed: FastFtFeed,
				Feed: Feed,
				content: contentData
			});
		})
		.catch(console.log);
	}
};
