/**
 * Perform click on html element when Enter is typed.
 * Use this on a focusable element with `data-click-with-enter`.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initClickWithEnter(elt: Element) {
    if (!(elt instanceof HTMLElement)) return

    elt.addEventListener('keyup', (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') {
        elt.click()
      }
    })
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-click-with-enter', initClickWithEnter)
  })

})()
