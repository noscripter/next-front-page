import {init as initDate, format} from 'o-date';
import React from 'react';

const dateFormat = 'h:mm a';

const linkHref = (id) => (id ? '/' + id.split('/').slice(-1)[0] : '');

class Article extends React.Component {
	componentDidMount() {
		const el = React.findDOMNode(this);
		initDate(el);
	}

	render() {
		const {id, title, lastPublished} = this.props.article;

		return (
			<article role='article' aria-labelledby={`${id}-title`}>
				<a href={linkHref(id)} tabIndex='0' data-trackable='feed-link'>
					<h2 id={`${id}-title`}>{title}</h2>
					<span>
						<time data-o-component='o-date' className='o-date' dateTime={lastPublished} aria-live='off'>
							{format(lastPublished, dateFormat)}
						</time>
					</span>
				</a>
			</article>
		);
	}
}

export default Article;
