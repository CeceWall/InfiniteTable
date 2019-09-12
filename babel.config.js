module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  plugins: ['transform-vue-jsx', 'lodash'],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              chrome: '58',
            },
            modules: 'commonjs',
          },
        ],
      ],
      plugins: ['transform-vue-jsx', 'istanbul'],
    },
  },
};
