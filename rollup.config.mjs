import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

import commonjs from '@rollup/plugin-commonjs';

/**
 * Determine whether to generate a production build.
 */
const isProduction = (process.env.NODE_ENV === 'production');

/**
 * Determine whether the user is watching for file changes.
 */
const isWatchMode = (typeof process.env.ROLLUP_WATCH !== 'undefined');

/**
 * A custom output plugin that replaces all dynamic imports with a custom
 * handler. Usefull for generating code that use a dynamic import polyfill.
 *
 * Note: Replaces the depreciated output option `dynamicImportFunction`.
 *
 * @see {@link https://rollupjs.org/guide/en/#renderdynamicimport}
 * @see {@link https://github.com/GoogleChromeLabs/dynamic-import-polyfill}
 * @param {string} name The name of the import function.
 * @returns {import('rollup').Plugin}
 */
const dynamicImportFunction = (name = '__import__') => ({
  name: 'dynamic-import-polyfill',
  renderDynamicImport: () => ({
    left: `${name}(`,
    right: ')',
  }),
});

export default {
  input: {
    main: 'src/scripts/main.js',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
    }),
  ],
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: isWatchMode ? 'inline' : true,
    entryFileNames: 'scripts/[name].mjs',
    chunkFileNames: 'scripts/[name].mjs',
    manualChunks: {
      vendor: ['wicked-elements'],
    },
    plugins: [
      dynamicImportFunction(),
      isProduction && terser({
        ecma: 6,
        module: true,
        compress: {
          passes: 2,
        },
      }),
    ],
  },
};
