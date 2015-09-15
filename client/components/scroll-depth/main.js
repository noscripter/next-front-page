'use strict';

var fireTracking = require('../../utils/fire-tracking');
var throttle = require('../../utils/throttle');

var toArray = nodeList => Array.prototype.slice.call(nodeList);

var track = componentId => {
	fireTracking('oTracking.event', { category: 'page', action: 'scrolldepth', component: componentId });
};

var components;
var scrollHandler = () => {
	components.forEach((componentEl, index) => {
		if (componentEl.getBoundingClientRect().top < window.innerHeight) {
			track(componentEl.dataset.trackable);
			components.splice(index, 1);
		}
	});
};

var init = flags => {
	components = toArray(document.querySelectorAll('.flexipod'));
	window.addEventListener('scroll', throttle(scrollHandler, 250));
};

module.exports = {
	init
};
