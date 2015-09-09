import fastFT from '../components/fastft/main';
import headerTabs from './components/header-tabs/main';
import highlightDomPath from './components/highlight-dom-path/main';

import layout from 'n-layout';
import setup from 'next-js-setup';
import oDate from 'o-date';
import nVideo from 'n-video';
import nAds from 'next-ads-component';
import prompts from 'n-message-prompts';

setup.bootstrap(({flags}) => {
	layout.init(flags);

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
	prompts.init();
	highlightDomPath();
});
