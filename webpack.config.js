var path = require('path');
var webpack = require('webpack');
var BowerWebpackPlugin = require("bower-webpack-plugin");

module.exports = {
	entry: "./client/main.js",
	output: {
		path: path.join(__dirname, "public"),
		filename: "main.js"
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: 'babel'
			}
		]
	},
	resolve: {
		root: [
			path.join(__dirname, 'bower_components')
		]
	},
	plugins: [
		new BowerWebpackPlugin({ includes: [/\.js?$/] }),
		// Global definitions
		new webpack.DefinePlugin({ 'define': undefined })
	],
	devtool: 'source-map'
};
