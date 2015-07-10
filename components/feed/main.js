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
			<div className="feed" tabIndex="0" role="region" aria-labelledby={this.props.labelId}>
				{articles}
			</div>
		);
	}
}

Feed.propTypes = {
	items: React.PropTypes.array.isRequired,
	labelId: React.PropTypes.string
};

export default {
	Feed
};
