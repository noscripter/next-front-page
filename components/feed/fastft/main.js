'use strict';

import React from 'react';
import Feed from '../main';

class FastFtFeed extends React.Component {
	render() {
		return (
			<div>
				<h1>
					<a href="/fastft">
						<span className="fastft__logo__fast">fast</span>
						<span className="fastft__logo__ft">FT</span>
						<i className="fastft__more-icon more-icon--fastft" />
					</a>
				</h1>
				<Feed title="fastFt" items={this.props.items} />
			</div>
		);
	}
}

FastFtFeed.propTypes = {
	items: React.PropTypes.array.isRequired
};


export default FastFtFeed;
