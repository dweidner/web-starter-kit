import {defineAsync} from 'wicked-elements';

/**
 * Main entry point of the application.
 *
 * @param {string} [environment='modern'] The name of the current browser environment.
 * @returns {void}
 */
export default function main(environment = 'modern') {
  const {documentElement} = document;

  // Note: Avoiding `DOMTokenList.replace` which is not supported in IE 11.
  documentElement.classList.remove('no-js');
  documentElement.classList.add('js');
  documentElement.classList.add(`is-${environment}`);

  defineAsync('[data-component="confetti-button"]', () => (
    import('./components/confetti-button.js')
  ));
}
