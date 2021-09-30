import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

import {terser} from 'rollup-plugin-terser';

/**
 * Determine whether to generate a production build.
 */
const isProduction = (process.env.NODE_ENV === 'production');

/**
 * Determine whether the user is watching for file changes.
 */
const isWatchMode = (typeof process.env.ROLLUP_WATCH !== 'undefined');

/**
 * Configure the rollup plugins for a specific target environment.
 *
 * @param {string} environment The name of the target environment.
 * @returns {import('rollup').Plugin[]}
 */
const configurePlugins = (environment) => ([
  nodeResolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    envName: environment,
    exclude: /node_modules/,
  }),
]);

/**
 * A custom output plugin that replaces all dynamic imports with a custom
 * handler. Usefull for generating code that use a dynamic import polyfill.
 *
 * Note: Replaces the depreciated output option `dynamicImportFunction`.
 *
 * @see {@link https://rollupjs.org/guide/en/#renderdynamicimport}
 * @see {@link https://github.com/GoogleChromeLabs/dynamic-import-polyfill}
 *
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

/**
 * Bundle configuration for modern browsers supporting ES module.
 *
 * @type {import('rollup').RollupOptions}
 */
const modernConfig = {
  input: {
    main: 'src/scripts/main.modern.js',
  },
  plugins: configurePlugins('modern'),
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

/**
 * Bundle configuration for legacy browsers not supporting ES modules.
 *
 * @type {import('rollup').RollupOptions}
 */
const legacyConfig = {
  input: {
    main: 'src/scripts/main.legacy.js',
  },
  plugins: configurePlugins('legacy'),
  output: {
    dir: 'dist',
    format: 'iife',
    sourcemap: isWatchMode ? 'inline' : true,
    entryFileNames: 'scripts/[name].js',
    chunkFileNames: 'scripts/[name].js',
    inlineDynamicImports: true,
    plugins: [
      isProduction && terser({
        ecma: 5,
        module: false,
        safari10: true,
        compress: {
          passes: 2,
        },
      }),
    ],
  },
};

/**
 * Rollup configuration containing multiple build outputs.
 */
const rollupConfig = [
  modernConfig,
  legacyConfig,
];

export default rollupConfig;
