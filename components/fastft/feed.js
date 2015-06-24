'use strict';

import React from 'react';
import Article from './article';

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {items: props.items};
	}

	render() {
		const articles = this.state.items.map((it) => <Article article={it} key={it.id} />)

		return (
			<div>
				<h1>fastFT</h1>
				{articles}
			</div>
		);
	}
}

export default Feed;
