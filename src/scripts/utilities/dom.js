/**
 * Find the first element that matches the given CSS selector.
 *
 * @param {string} selector
 * @param {Element} context
 * @returns {?Element}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Find all elements that matches the given CSS selector.
 *
 * @param {string} selector
 * @param {Element} context
 * @returns {Element[]}
 */
export function $$(selector, context = document) {
  return Array.prototype.slice.call(context.querySelectorAll(selector));
}
