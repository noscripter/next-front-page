'use strict';

module.exports = () => {

	var domPath = document.location.hash.split('#').pop();
	if (/^domPath:/.test(domPath)) {
		var selector = domPath
			.replace(/^domPath:/, '')
			.split(' | ')
			.map(part => `[data-trackable="${part}"]`)
			.join(' ');
		[...document.querySelectorAll(selector)]
			.forEach(el => el.classList.add('dom-path-highlight'));
	}

}
