'use strict';

var requestAnimationFrame = (fn, args) => {
	if (window.requestAnimationFrame) {
		window.requestAnimationFrame(() => fn(args));
	} else {
		fn(arguments);
	}
};

module.exports = (fn, threshold) => {
	var lastFired;
	var timer;

	return () => {
		if (timer) {
			return;
		}
		var now = +new Date();
		if (!lastFired || lastFired + threshold < now) {
			requestAnimationFrame(fn, arguments);
			lastFired = now;
		} else if (!timer) {
			var delay = threshold - (now - lastFired);
			timer = setTimeout(() => {
				timer = null;
				requestAnimationFrame(fn, arguments);
				lastFired = +new Date();
			}, delay);
		}
	}
};
