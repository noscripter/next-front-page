'use strict';

import React from 'react';
import Article from './article';

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {items: props.items || []};
	}

	render() {
		const articles = this.state.items.map((it) => <Article article={it} key={it.id} />);

		return (
			<div className="feed">
				{articles}
			</div>
		);
	}
}

Feed.propTypes = {
	items: React.PropTypes.array.isRequired
};

export default Feed;
