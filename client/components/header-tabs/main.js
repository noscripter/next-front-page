const selectTab = (link) => {
	link.className = 'selected';
	link.setAttribute('aria-selected', true);
};

const clearSelection = (links) => {
	links.forEach(it => {
		it.className = '';
		it.setAttribute('aria-selected', false);
	});
};

const clickHandler = (links, link) => {
	return () => {
		clearSelection(links);
		selectTab(link);
	};
};

const init = (el, initialTab) => {
	el = el || document.body;

	const links = Array.prototype.slice.call(el.getElementsByTagName('a'));

	links.forEach(link => {
		if(link.addEventListener) {
			link.addEventListener('click', clickHandler(links, link), false);
		}

		if(link.attachEvent) {
			link.attachEvent('onclick', function(){
				return clickHandler(links, link)([window.event]);
			});
		}
	});

	if(window.location.hash) {
		let tab = links.filter(l => l.getAttribute('href') === window.location.hash)[0];
		if(tab) { selectTab(tab); }
	} else {
		let tab = links.filter(l => l.getAttribute('href') === initialTab)[0];
		selectTab(tab);
	}
};

export default {
	init: init
};
