'use strict';

var fireTracking = require('../../utils/fire-tracking');
var throttle = require('../../utils/throttle');

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
	components = Array.from(document.querySelectorAll('.flexipod'));
	window.addEventListener('scroll', throttle(scrollHandler, 250));
};

module.exports = {
	init
};
