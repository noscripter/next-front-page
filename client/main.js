'use strict';

var oDate = require('o-date');
var setup = require('next-js-setup');

setup.bootstrap(function (result) {
	var flags = result.flags;

	oDate.init();
	var headerFooter = require('n-header-footer');
	headerFooter.init(flags);
});
