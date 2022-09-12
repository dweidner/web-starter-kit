import {initialize as initializeImportPolyfill} from 'dynamic-import-polyfill';
import {defineAsync} from 'wicked-elements';

initializeImportPolyfill({
  modulePath: '/scripts/',
});

document.documentElement.classList.replace('no-js', 'js');

defineAsync('[data-component="confetti-button"]', () => (
  import('./components/confetti-button.js')
));
