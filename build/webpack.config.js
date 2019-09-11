const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');


module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'infinite-table.common.js',
  },
});
