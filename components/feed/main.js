'use strict';

import React from 'react/addons';
import Article from './article';

let Anim = React.addons.CSSTransitionGroup;

class Feed extends React.Component {
	render() {
		const articles = this.props.items.map((it) => <Article article={it} key={it.id} />);

		return (
			<Anim
				transitionName="fade"
				className="feed"
				tabIndex="0"
				role="region"
				aria-labelledby={this.props.labelId} >
				{articles}
			</Anim>
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
