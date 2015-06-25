'use strict';

import {init as initDate, format} from 'o-date'
import React from 'react';

const dateFormat = "h:mm a";

class Article extends React.Component {
	componentDidMount() {
		const el = React.findDOMNode(this);

		console.log("o-datifying", el);

		initDate(el);
	}

	render() {
		const {title, publishedDate} = this.props.article;

		return (
			<article>
				<h2>{title}</h2>
				<time data-o-component="o-date" className="o-date" dateTime={format(publishedDate, 'datetime')}>
					{format(publishedDate, dateFormat)}
				</time>
			</article>
		)
	}
}

export default Article;
