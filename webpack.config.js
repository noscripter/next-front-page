var path = require('path');
var webpack = require('webpack');
var BowerWebpackPlugin = require("bower-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
	new BowerWebpackPlugin({ includes: [/\.js?$/] }),
	// Global definitions
	new webpack.DefinePlugin({
		'define': undefined,
		"process.env": {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
		}
	}),
	new ExtractTextPlugin("main.css")
];

if(process.env.NODE_ENV === 'production') {
	plugins = plugins.concat([
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin()
	]);
}



var config = {
	entry: "./client/main.js",
	output: {
		path: path.join(__dirname, "public"),
		filename: "main.js"
	},
	module: {
		loaders: [
			{ test: /\.js?$/, loader: 'babel' },
			{
				test: /\.scss|sass?$/,
				loader: ExtractTextPlugin.extract(
					[
						"css",
						"autoprefixer",
						"sass?includePaths[]=" + (path.resolve(__dirname, "./bower_components"))
					].join("!")
				)
			}
		]
	},
	resolve: {
		root: [
			path.join(__dirname, 'bower_components')
		]
	},
	plugins: plugins
};

module.exports = config;
