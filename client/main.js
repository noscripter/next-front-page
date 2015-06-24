'use strict';

import oDate from 'o-date';
import setup from 'next-js-setup';
import headerFooter from 'n-header-footer';

setup.bootstrap((result) => {
	var flags = result.flags;

	oDate.init();
	headerFooter.init(flags);
});
