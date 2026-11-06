/**
 * Toggle .light and .dark classes on the document body when clicked.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function toggleDarkMode() {
    document.body.classList.toggle('light')
    document.body.classList.toggle('dark')
  }

  function initDarkModeToggle(elt: Element) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) toggleDarkMode()
    elt.addEventListener('click', toggleDarkMode);
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-dark-mode-toggle', initDarkModeToggle)
  })
})()
