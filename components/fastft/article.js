'use strict';

import {format} from 'o-date'
import React from 'react';

const dateFormat = "EEEE, d MMMM, yyyy";

class Article extends React.Component {
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
