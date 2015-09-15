'use strict';

module.exports = (fn, threshold) => {
	var lastFired;
	var timer;

	return () => {
		var now = +new Date();
		if (!lastFired || lastFired + threshold < now) {
			fn.apply(this, arguments);
			lastFired = now;
		} else if (!timer) {
			var delay = threshold - (now - lastFired);
			timer = setTimeout(() => {
				timer = null;
				fn.apply(this, arguments);
				lastFired = +new Date();
			}, delay);
		}
	}
};
