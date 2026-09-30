/**
 * Helpers for htmx 4 extensions that initialize elements which may not have
 * htmx attributes. htmx 4 only fires `htmx:after:init` for elements with
 * hx-* attributes, so we use `htmx.onLoad` to catch page-load and swapped
 * content. An "initialized" flag is used to avoid attaching listeners twice.
 */
export function forEachElementOnce(
  root: Element,
  attributeName: string,
  callback: (elt: Element) => void
) {
  const initializedAttributeName = attributeName + '-initialized'
  const selector = '[' + attributeName + ']:not([' + initializedAttributeName + '])'
  const elements: Element[] = []

  if (root.matches(selector)) {
    elements.push(root)
  }
  root.querySelectorAll(selector).forEach((elt) => elements.push(elt))

  for (const elt of elements) {
    elt.setAttribute(initializedAttributeName, 'true')
    callback(elt)
  }
}
