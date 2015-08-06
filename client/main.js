import fastFT from '../components/fastft/main';
import headerTabs from './components/header-tabs/main';

import setup from 'next-js-setup';
import headerFooter from 'n-header-footer';
import oDate from 'o-date';
setup.bootstrap(({flags}) => {
	headerFooter.init(flags);

	const feedContainer = document.getElementById("fastft");
	fastFT.init(feedContainer);

	const tabs = document.getElementById("header-tabs");
	headerTabs.init(tabs, "#news-tab");

	oDate.init();
});
