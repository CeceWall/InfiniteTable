const webpackConfig = require('./build/webpack.test.config.js');

module.exports = (config) => {
  config.set({
    frameworks: ['mocha'],
    files: ['tests/**/*.spec.js', 'tests/**/*.spec.jsx'],
    preprocessors: {
      'tests/**/*.spec.js': ['webpack', 'sourcemap'],
      'tests/**/*.spec.jsx': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: './coverage',
      reporters: [{ type: 'lcov', subdir: '.' }, { type: 'text-summary' }]
    },
    browsers: ['Chrome'],
  });
};
