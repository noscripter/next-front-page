import 'n-message-prompts';
import fastFT from '../components/fastft/main';
import headerTabs from './components/header-tabs/main';

import setup from 'next-js-setup';
import headerFooter from 'n-header-footer';
import oDate from 'o-date';
import nVideo from 'n-video';
import nAds from 'next-ads-component';


setup.bootstrap(({flags}) => {
	headerFooter.init(flags);

	const feedContainer = document.getElementById('fastft');
	fastFT.init(feedContainer);

	const tabs = document.getElementById('header-tabs');
	headerTabs.init(tabs, '#news-tab');

	nVideo.init({
		optimumWidth: 710,
		placeholder: true,
		classes: ['video'],
		selector: '.js-video'
	});

	if(flags.get('frontPageAds')) {
		nAds.init(flags);
	}
	oDate.init();
});
