import React from 'react';
import FastFtFeed from "./fastftfeed";

const init = (el, opts) => {
	el = el || document.body;
	const initialItems = JSON.parse(el.getAttribute('data-fastft-articles'));

	React.render(<FastFtFeed items={initialItems} />, el);

	const poller = () => {
		fetch('/home/fastft.json', {credentials: 'include'})
		.then((response) => {
			if(response.status > 200) {
				throw new Error('Bad response from server');
			}

			return response.json();
		})
		.then((fastft) => {
			React.render(<FastFtFeed items={fastft.items} />, el);
		})
		.catch((error) => {
			console.log(error);
		});
	};

	setInterval(poller, 60000);
};

export default {
	init: init,
	FastFtFeed: FastFtFeed
};
