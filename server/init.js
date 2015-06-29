import express from 'ft-next-express';
import React from 'react';

// routes
import frontPage from './routes/front-page';
import fastft from './routes/fastft';

var app = express({
	helpers: {
		lowercase: (it) => it.toLowerCase(),
		reactRenderToString: (klass, props) => {
			return React.renderToString(React.createElement(klass, props));
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

app.get('/fastft.json', fastft);

var port = process.env.PORT || 3001;

export default app;
export let listen = app.listen(port, () => {
	console.log('Listening on ' + port);
});
