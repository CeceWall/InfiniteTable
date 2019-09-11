const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  entry: path.resolve(__dirname, '../example/main.js'),
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, '../dist/example'),
    filename: 'demo.js',
  },
  devServer: {
    historyApiFallback: true,
    overlay: true,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'example/index.html',
    }),
  ],
});
