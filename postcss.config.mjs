import {resolve} from 'path';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import postcssCustomMedia from 'postcss-custom-media';
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
 * @returns {import('postcss').Transformer[]}
 */
const configurePlugins = () => ([
  postcssImport(),
  postcssUrl([{
    url: 'inline',
    filter: /\.(svg|png)$/,
    basePath: resolve('src/images'),
    maxSize: 2,
  }]),
  postcssCustomMedia(),
  postcssNesting(),
  postcssCalc(),
  postcssGap(),
  postcssInset(),
  postcssFunctionalColorNotation(),
  autoprefixer(),
]);

/**
 * Context dependent PostCSS configuration.
 *
 * @param {object} context The current build context.
 * @param {string} context.env The current build environment.
 * @param {object} context.options Additional options provided to the build command.
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
