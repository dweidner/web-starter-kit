import {
  defineConfig,
  splitVendorChunkPlugin,
} from 'vite';

export default defineConfig({
  root: './src',
  envDir: '../',
  publicDir: '../static',
  build: {
    outDir: '../dist',
    assetsDir: './assets',
    sourcemap: true,
    manifest: true,
    plugins: [
      splitVendorChunkPlugin(),
    ],
  },
});
