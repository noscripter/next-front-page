import React from 'react';
import FastFtFeed from './fastftfeed';

const renderFeed = (el, items) => {
	React.render(<FastFtFeed items={items} />, el);
}

const init = (el, opts) => {
	el = el || document.body;
	const initialItems = JSON.parse(el.getAttribute('data-fastft-articles'));
	let items = null;

	renderFeed(el, initialItems);

	const poller = () => {
		fetch('/home/fastft.json', {credentials: 'include'})
		.then((response) => {
			if(response.status > 200) {
				throw new Error('Bad response from server');
			}

			return response.json();
		})
		.then((fastft) => {
			items = fastft.items;

			if(document.visibilityState !== 'hidden') {
				renderFeed(el, items);
			}
		})
		.catch((error) => {
			console.log(error);
		});
	};

	document.addEventListener('visibilitychange', function() {
		if(document.visibilityState === 'visible') {
			renderFeed(el, items);
		}
	});

	setInterval(poller, 60000);
};

export default {
	init: init,
	FastFtFeed: FastFtFeed
};
