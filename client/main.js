'use strict';

var oDate = require('o-date');
var setup = require('next-js-setup');
var fastFT = require('../components/fastft/main');

setup.bootstrap(function (result) {
	var flags = result.flags;

	oDate.init();
	var headerFooter = require('n-header-footer');
	headerFooter.init(flags);

	const feedContainer = document.getElementById("fastft");
	fastFT.init(feedContainer);
});
