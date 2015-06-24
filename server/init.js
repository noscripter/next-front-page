'use strict';

import express from 'ft-next-express';
import frontPage from './routes/front-page';
import React from 'react';

var app = express({
	helpers: {
		reactRenderToString: (klass, props) => {
			return React.renderToString(React.createElement(klass, props));
		}
	},
});

app.get('/__gtg', (req, res) => {
	res.status(200).end();
});
app.get('/', (req, res) => {
	res.sendStatus(404);
});

// app routes

app.get('/international', frontPage);
app.get('/uk', frontPage);

var port = process.env.PORT || 3001;

export default app;
export let listen = app.listen(port, () => {
	console.log('Listening on ' + port);
});
