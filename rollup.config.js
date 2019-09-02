import VuePlugin from 'rollup-plugin-vue';
import SassPlugin from 'rollup-plugin-sass';
import BabelPlugin from 'rollup-plugin-babel';
import CommonJSPlugin from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';

export default {
  input: 'src/table.vue',
  output: {
    file: 'dist/infinite-table.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    css(),
    CommonJSPlugin({
      include: 'node_modules/**',
    }),
    VuePlugin({
      css: false,
    }),
    BabelPlugin({
      include: 'src/**/*.jsx',
      // exclude: 'node_modules/**',
      runtimeHelpers: false,
    }),
    SassPlugin({
      output: 'dist/infinite-table.css',
    }),
  ],
};
