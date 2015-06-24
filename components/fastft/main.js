'use strict';

import React from 'react';
import Feed from './feed';

const init = (el, opts) => {
	const el = el || document.body;
	const initialItems = JSON.parse(el.getAttribute('data-fastft-articles'));

	const feedInstance = React.render(<Feed title="fastFt" items={initialItems} />, el);
}

export default {
	init: init
}
