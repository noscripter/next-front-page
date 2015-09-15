'use strict';

var fireTracking = require('../../utils/fire-tracking');
var throttle = require('../../utils/throttle');

var toArray = nodeList => Array.prototype.slice.call(nodeList);

var track = componentPos => fireTracking('oTracking.event', { category: 'page', action: 'scrolldepth', componentPos: componentPos });

var scrollHandlerFactory = components => {
	var componentsViewed = [];
	return () => {
		components.forEach((component, index) => {
			if (component.getBoundingClientRect().top < window.innerHeight && componentsViewed.indexOf(component) === -1) {
				track(index + 1);
				componentsViewed.push(component);
			}
		});
	};
};

var init = () => {
	var components = toArray(document.querySelectorAll('.flexipod'));
	window.addEventListener('scroll', throttle(scrollHandlerFactory(components), 250));
};

module.exports = {
	init
};
