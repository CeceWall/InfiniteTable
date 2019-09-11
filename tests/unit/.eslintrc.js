module.exports = {
  env: {
    mocha: true,
  },
  settings: {
    'import/resolver': {
      webpack:{
        config: './build/webpack.config.js'
      }
    }
  }
};
