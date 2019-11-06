const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  entry: './src/index.js',
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'infinite-table.js',
    library: 'InfiniteTable',
    libraryExport: 'default',
    libraryTarget: 'umd',
	globalObject: 'typeof self !== \'undefined\' ? self : this' 
  },
  externals: {
    vue: {
		commonjs: 'vue',
		commonjs2: 'vue',
		root: 'Vue',
		amd: 'vue'
	},
  },
  plugins: [
    new BundleAnalyzerPlugin(),
  ],  
  optimization: {
    minimize: false
  }
});
