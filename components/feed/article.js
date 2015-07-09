import {init as initDate, format} from 'o-date';
import React from 'react';

const dateFormat = "h:mm a";

const linkHref = (id) => '/' + id.split('/').slice(-1)[0];

class Article extends React.Component {
	componentDidMount() {
		const el = React.findDOMNode(this);
		initDate(el);
	}

	render() {
		const {id, title, publishedDate} = this.props.article;

		return (
			<article>
				<a href={linkHref(id)} tabIndex="0" data-trackable="feed-link">
					<h2>{title}</h2>
					<span>
						<i className="time-icon" aria-label="Published" />
						<time data-o-component="o-date" className="o-date" dateTime={publishedDate}>
							{format(publishedDate, dateFormat)}
						</time>
					</span>
				</a>
			</article>
		);
	}
}

export default Article;
