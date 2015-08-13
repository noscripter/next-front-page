var path = require('path');
var webpack = require('webpack');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
	new BowerWebpackPlugin({ includes: [/\.js?$/] }),
	// Global definitions
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
		}
	}),
	new ExtractTextPlugin('main.css'),
	new webpack.NoErrorsPlugin()
];

if(process.env.NODE_ENV === 'production') {
	plugins = plugins.concat([
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin()
	]);
}

var config = {
	entry: ['./client/main.js', './client/main.scss'],
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'main.js'
	},
	module: {
		loaders: [
			{ test: /\.js?$/, loader: 'babel' },
			{ test: /fastclick\.js$/, loader: 'imports?define=>false' }, // force fastclick to load CommonJS
			{
				test: /\.scss|sass?$/,
				loader: ExtractTextPlugin.extract(
					[
						'css',
						'autoprefixer',
						'sass?includePaths[]=' + (path.resolve(__dirname, './bower_components'))
					].join('!')
				)
			}
		]
	},
	resolveLoader: {
		fallback:	path.join(__dirname, 'node_modules')
	},
	resolve: {
		root: [
			path.join(__dirname, 'bower_components')
		]
	},
	plugins: plugins,
	devtool: "source-map"
};

module.exports = config;
