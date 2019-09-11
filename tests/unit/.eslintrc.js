module.exports = {
  env: {
    mocha: true,
  },
  rules: {
    'no-unused-expressions': 0,
  },
  settings: {
    'import/resolver': {
      webpack:{
        config: 'build/webpack.config.js'
      }
    }
  }
};
