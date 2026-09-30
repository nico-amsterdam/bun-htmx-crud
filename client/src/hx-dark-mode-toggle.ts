/**
 * Toggle .light and .dark classes on the document body when clicked.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initDarkModeToggle(elt: Element) {
    elt.addEventListener('click', () => {
      document.body.classList.toggle('light')
      document.body.classList.toggle('dark')
    })
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-dark-mode-toggle', initDarkModeToggle)
  })
})()
