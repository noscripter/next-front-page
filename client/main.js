'use strict';

import oDate from 'o-date';
import setup from 'next-js-setup';
import fastFT from '../components/fastft/main';
import headerFooter from 'n-header-footer';
import headerTabs from './components/header-tabs/main';

setup.bootstrap((result) => {
	var flags = result.flags;

	headerFooter.init(flags);

	const feedContainer = document.getElementById("fastft");
	// fastFT.init(feedContainer);

	const tabs = document.getElementById("header-tabs");
	headerTabs.init(tabs, "#news-tab");

	oDate.init();
});
