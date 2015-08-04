/*global console*/
"use strict";

require('es6-promise').polyfill();
require('isomorphic-fetch');
var TEST_HOST = process.env.TEST_URL;

module.exports = {
	"js-success test": function(browser) {
		console.log("Launching " + TEST_HOST + "/uk");
		browser
			.url(TEST_HOST + "/__gtg")
			.setCookie({ name: 'next-flags', domain: TEST_HOST, value: 'ads:off', secure: true })
			.url(TEST_HOST + "/uk")
			.waitForElementPresent("html.js.js-success", 60000)
			.end();
	}
};
