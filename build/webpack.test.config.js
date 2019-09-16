const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  entry: path.resolve(__dirname, '../src/table.vue'),
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test'),
    }),
  ],
});
