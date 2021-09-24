import dynamicImportPolyfill from 'dynamic-import-polyfill';
import main from './main.js';

dynamicImportPolyfill.initialize({
  modulePath: '/scripts/',
});

main('modern');
