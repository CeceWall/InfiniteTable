const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  entry: './src/index.js',
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'infinite-table.js',
    library: 'InfiniteTable',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  externals: {
    vue: 'Vue',
  },
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
});
