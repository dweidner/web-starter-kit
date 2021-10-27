/**
 * Returns the reference of the first element that matches the given CSS
 * selector.
 *
 * @param {string} selector The CSS selector.
 * @param {Element} context The element to start searching from.
 * @returns {?Element}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Returns the reference of all elements that matches the given CSS selector.
 *
 * @param {string} selector The CSS selector.
 * @param {Element} context The element to start searching from.
 * @returns {Element[]}
 */
export function $$(selector, context = document) {
  return Array.prototype.slice.call(context.querySelectorAll(selector));
}
