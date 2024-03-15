import postcssJitProps from 'postcss-jit-props';
import postcssPresetEnv from 'postcss-preset-env';

import Colors from 'open-props/src/props.colors.js';
import Shadows from 'open-props/src/props.shadows.js';

export default {
  plugins: [
    postcssJitProps({
      files: [
        './src/styles/tokens/*.css',
      ],
      ...Colors,
      ...Shadows,
    }),
    postcssPresetEnv({
      stage: 2,
      features: {
        'blank-pseudo-class': false,
        'custom-properties': false,
        'focus-visible-pseudo-class': false,
        'focus-within-pseudo-class': false,
        'has-pseudo-class': false,
        'image-set-function': false,
        'light-dark-function': false,
        'prefers-color-scheme-query': false,
      },
    }),
  ],
};
