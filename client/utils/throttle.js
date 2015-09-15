'use strict';

var requestAnimationFrame = (fn, args) => {
	if (window.requestAnimationFrame) {
		window.requestAnimationFrame(() => fn.apply(null, args));
	} else {
		fn(arguments);
	}
};

module.exports = (fn, threshold) => {
	var lastFired;
	var timer;

	return (...args) => {
		if (timer) {
			return;
		}
		var now = +new Date();
		if (!lastFired || lastFired + threshold < now) {
			requestAnimationFrame(fn, args);
			lastFired = now;
		} else {
			var delay = threshold - (now - lastFired);
			timer = setTimeout(() => {
				timer = null;
				requestAnimationFrame(fn, args);
				lastFired = +new Date();
			}, delay);
		}
	}
};
