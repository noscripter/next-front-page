import 'isomorphic-fetch';
import React from 'react';
import FastFtFeed from "./main";

const init = (el, opts) => {
	el = el || document.body;
	const initialItems = JSON.parse(el.getAttribute('data-fastft-articles'));

	const feedInstance = React.render(<FastFtFeed items={initialItems} />, el);

	const poller = () => {
		fetch('/home/fastft.json')
		.then((response) => {
			if(response.status > 200) {
				throw new Error('Bad response from server');
			}

			return response.json();
		})
		.then((fastft) => {
			return feedInstance.setState({items: fastft.items});
		})
		.catch(console.log);
	};

	setInterval(poller, 20000);
};

export default {
	init: init
};
