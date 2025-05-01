var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const historyApiFallback = require('connect-history-api-fallback');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  output: {
    publicPath: '/'
  },
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
       template: path.resolve(__dirname, 'src/index.html'),
       publicPath: '/',
    })
 ]
};
