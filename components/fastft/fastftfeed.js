'use strict';

import React from 'react';
import {Feed} from '../feed/main';

class FastFtFeed extends React.Component {
	render() {
		return (
			<div aria-live="assertive">
				<h1>
					<a href="/fastft" data-trackable="go-to-link">
						<span className="fastft__logo__fast">fast</span>
						<span className="fastft__logo__ft" aria-label="ef tee">FT</span>
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
