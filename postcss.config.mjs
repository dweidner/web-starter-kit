import {isSupported} from 'caniuse-api';
import {resolve} from 'path';
import {browserslist} from './package.json';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssNesting from 'postcss-nesting';
import postcssCalc from 'postcss-calc';
import postcssGap from 'postcss-gap-properties';
import postcssInset from 'postcss-inset';
import postcssFunctionalColorNotation from 'postcss-color-functional-notation';

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
    basePath: resolve('src/images'),
    maxSize: 2,
  }]),
  !isSupported('css-variables', browserslist[env]) && postcssCustomProperties({
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

export default postcssConfig;
