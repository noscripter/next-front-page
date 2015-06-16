import express from 'ft-next-express';
import frontPage from './routes/front-page';

var app = express({
	helpers: {
		dump: (it) => JSON.stringify(it)
	}
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
