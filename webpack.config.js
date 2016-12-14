var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var BannerPlugin = require("webpack/lib/BannerPlugin");
var path = require('path');
var env = require('yargs').argv.mode;
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var libraryName = 'jquery.aa';

var plugins = [
    new BannerPlugin('jQuery.aa.js\nsertion@innorix.com\nhttps://github.com/skt-t1-byungi/jQuery.aa.js'),
    // new BundleAnalyzerPlugin()
  ],
  outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

var config = {
  entry: __dirname + '/src/index.js',
  devtool: env === 'build' ? 'hidden-source-map' : 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /(\.jsx|\.js)$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/
    }, {
      test: /(\.jsx|\.js)$/,
      loader: "eslint-loader",
      exclude: /node_modules/
    }]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: plugins,
  externals: {
    "jquery": "jQuery",
    "mustache": "Mustache"
  },
};

module.exports = config;