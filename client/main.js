'use strict';

var oDate = require('o-date');
var setup = require('next-js-setup');

setup.bootstrap(function (/*result*/) {
	oDate.init();
});
