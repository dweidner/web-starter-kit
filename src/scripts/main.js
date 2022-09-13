import {defineAsync} from 'wicked-elements';

document.documentElement.classList.replace('no-js', 'js');

defineAsync('[data-component="confetti-button"]', () => (
  import('./components/confetti-button.js')
));
