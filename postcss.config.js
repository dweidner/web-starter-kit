const cssnano = require('cssnano');

const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const postcssHash = require('postcss-hash');

const {browserslist} = require('./package.json');

/**
 * Determine whether to generate a production build.
 */
const isProduction = (process.env.NODE_ENV === 'production');

/**
 * Configure the PostCSS plugins for a specific target environment.
 *
 * Note: Fetches the browser list for legacy browsers from the `package.json`
 * as PostCSS does not support custom environment names as input.
 *
 * @returns {import('postcss').Transformer[]}
 */
const configurePlugins = () => ([
  postcssImport(),
  postcssPresetEnv({
    browsers: browserslist.legacy,
    stage: 3,
    features: {
      'custom-media-queries': true,
      'nesting-rules': true,
      'not-pseudo-class': true,
      'matches-pseudo-class': true,
      'overflow-property': true,
      'overflow-wrap': true,
      'system-ui-font-family': true,
      'custom-properties': false,
    },
  }),
]);

/**
 * Configure the CSS minifiers to use for production environments.
 *
 * @returns {import('postcss').Transformer[]}
 */
const configureMinifiers = () => ([
  cssnano({
    preset: 'default',
  }),
  postcssHash({
    manifest: './dist/asset-manifest.json',
    algorithm: 'sha256',
  }),
]);

/**
 * Context dependent PostCSS configuration.
 */
const postcssConfig = (context) => ({
  map: context.options.map,
  plugins: [
    ...configurePlugins(),
    ...isProduction ? configureMinifiers() : [],
  ],
});

module.exports = postcssConfig;
