import {equal as assertEqual} from 'assert';
import express from 'ft-next-express';
import React from 'react';
import bodyParser from 'body-parser';

// routes
import frontPage from './routes/front-page';
import fastft from './routes/fastft';
import query from './routes/query';

var app = express({
	helpers: {
		lowercase: (it) => it && it.toLowerCase(),
		reactRenderToString: (klass, props) => {
			return React.renderToString(React.createElement(klass, props.hash));
		},
		getImage(images, type, maxWidth) {
			assertEqual(typeof maxWidth, 'number', 'getImageSrc: maxWidth must be a number');
			const image = images && images.find(img => img.type === type);
			return image ? Object.assign(
				{ src: `//next-geebee.ft.com/image/v1/images/raw/${image.url}?source=next&fit=scale-down&width=${maxWidth}` },
				image
			) : null;
		}
	},
	serviceDependencies: {
		'most-popular': /^http:\/\/mostpopular\.sp\.ft-static\.com\/v1\/mostPopular/
	}
});

app.use(bodyParser.text());

app.get('/__gtg', (req, res) => {
	res.status(200).end();
});
app.get('/', (req, res) => {
	res.sendStatus(404);
});

// app routes
app.get('/front-page', frontPage('UK'));
app.get('/international', frontPage('US'));
app.get('/uk', frontPage('UK'));

app.get('/home/fastft.json', fastft);
app.post('/front-page/query.json', query);

var port = process.env.PORT || 3001;

export default app;
export let listen = app.listen(port, () => {
	console.log('Listening on ' + port);
});
