'use strict';
import {uk as contentConfig} from '../config/content'
import {pollContent} from '../services/content-api';

// Content cache for polling

var content = {
	elastic: {
		top: [],
		fastFt: []
	},
	capi1: {
		top: [],
		fastFt: []
	}
};

// Poll both APIs so that we can feature flag between them

Object.keys(contentConfig)
.forEach(it => {
	if(contentConfig[it].useElasticSearch) {
		pollContent(
			contentConfig[it],
			true,
			page => content.elastic[it] = page
		);
	}

	pollContent(
		contentConfig[it],
		false,
		page => content.capi1[it] = page
	);
});

module.exports = function(req, res) {
	var source = (res.locals.flags.elasticSearchItemGet.isSwitchedOn ? content.elastic : content.capi1);
	if(source.top.items && source.top.items.slice) {
		source.top.items = source.top.items.slice(0, 10);
	}

	res.render('uk', {
		layout: 'wrapper',
		articles: source.top,
		fastFt: source.fastFt
	});
};
