import {equal as assertEqual} from 'assert';
import express from 'ft-next-express';
import React from 'react';

// routes
import frontPage from './routes/front-page';
import fastft from './routes/fastft';

var app = express({
	helpers: {
		lowercase: (it) => it && it.toLowerCase(),
		reactRenderToString: (klass, props) => {
			return React.renderToString(React.createElement(klass, props));
		},
		getImage(images, type, maxWidth) {
			assertEqual(typeof maxWidth, 'number', 'getImageSrc: maxWidth must be a number');
			const image = images && images.find(img => img.type === type);
			return image ? Object.assign(
				{ src: `//next-geebee.ft.com/image/v1/images/raw/${image.url}?source=next&fit=scale-down&width=${maxWidth}` },
				image
			) : null;
		}
	}
});

app.get('/__gtg', (req, res) => {
	res.status(200).end();
});
app.get('/', (req, res) => {
	res.sendStatus(404);
});

// app routes
app.get('/front-page', frontPage);
app.get('/international', frontPage);
app.get('/uk', frontPage);

app.get('/home/fastft.json', fastft);

var port = process.env.PORT || 3001;

export default app;
export let listen = app.listen(port, () => {
	console.log('Listening on ' + port);
});
