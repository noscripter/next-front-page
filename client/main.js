'use strict';

import oDate from 'o-date';
import setup from 'next-js-setup';
import fastFT from '../components/fastft/main';
import headerFooter from 'n-header-footer';

setup.bootstrap((result) => {
	var flags = result.flags;

	headerFooter.init(flags);

	const feedContainer = document.getElementById("fastft");
	fastFT.init(feedContainer);

	oDate.init();
});
