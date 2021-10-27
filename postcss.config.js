const path = require('path');

const autoprefixer = require('autoprefixer');
const caniuse = require('caniuse-api');
const cssnano = require('cssnano');

const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const postcssCustomMedia = require('postcss-custom-media');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssNesting = require('postcss-nesting');
const postcssCalc = require('postcss-calc');
const postcssGap = require('postcss-gap-properties');
const postcssInset = require('postcss-inset');
const postcssFunctionalColorNotation = require('postcss-color-functional-notation');

const {browserslist} = require('./package.json');

/**
 * Determine whether a feature is supported in a given target environment.
 *
 * @param {string} feature The feature to test for.
 * @param {string} env The name of the target environment.
 * @returns {boolean}
 */
const isSupported = (feature, env = 'legacy') => (
  caniuse.isSupported(feature, browserslist[env])
);

/**
 * Configure PostCSS plugins that transform modern CSS features into something
 * that all target browsers can understand.
 *
 * Note: Not using postcss-preset-env here to be more specific about the
 * included transforms.
 *
 * @param {string} [env='legacy'] The name of the target environment.
 * @returns {import('postcss').Transformer[]}
 */
const configurePlugins = (env = 'legacy') => ([
  postcssImport(),
  postcssUrl([{
    url: 'inline',
    filter: /\.(svg|png)$/,
    basePath: path.resolve('src/images'),
    maxSize: 2,
  }]),
  !isSupported('css-variables', env) && postcssCustomProperties({
    preserve: false,
    importFrom: [
      'src/styles/settings/_settings.breakpoints.css',
      'src/styles/settings/_settings.typography.css',
      'src/styles/settings/_settings.colors.css',
      'src/styles/settings/_settings.layout.css',
      'src/styles/settings/_settings.layers.css',
      'src/styles/settings/_settings.animation.css',
      'src/styles/settings/_settings.elevation.css',
      'src/styles/settings/_settings.misc.css',
    ],
  }),
  postcssCustomMedia(),
  postcssNesting(),
  postcssCalc(),
  postcssGap(),
  postcssInset(),
  postcssFunctionalColorNotation(),
  autoprefixer({
    env,
  }),
]);

/**
 * Context dependent PostCSS configuration.
 *
 * @param {object} context
 * @returns {object}
 */
const postcssConfig = ({env, options}) => {
  const isProduction = (env === 'production');

  const config = {
    map: options.map,
    plugins: [
      ...configurePlugins(),
      ...isProduction ? [cssnano()] : [],
    ],
  };

  return config;
};

module.exports = postcssConfig;
