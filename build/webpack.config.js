const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');

merge(baseConfig, {
  mode: 'production',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'infinite-table.common.js',
  },
});


module.exports = {
  entry: './src/main.js',
  mode: process.env.NODE_ENV || 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
  },
  externals: {
    vue: 'Vue',
  },
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production',
      },
    }),
  ],
};
