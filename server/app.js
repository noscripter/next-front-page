'use strict';

var express = require('ft-next-express');
var frontPage = require('./routes/front-page');

var app = express({
	helpers: {
		dump: function(it) {
			return JSON.stringify(it);
		}
	}
});

app.get('/__gtg', function(req, res) {
	res.status(200).end();
});
app.get('/', function (req, res) {
	res.sendStatus(404);
});

// app routes

app.get('/international', frontPage);
app.get('/uk', frontPage);

var port = process.env.PORT || 3001;

module.exports = app;
module.exports.listen = app.listen(port, function() {
	console.log('Listening on ' + port);
});
