/**
 * Navigate to a URL on click.
 * Specify the URL via the `data-navigate` attribute.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initNavigate(elt: Element) {
    const url = elt.getAttribute('data-navigate')
    if (!url) return

    elt.addEventListener('click', () => {
      window.location.href = url
    })
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-navigate', initNavigate)
  })
})()
