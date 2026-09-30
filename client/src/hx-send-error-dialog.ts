/**
 * Show a modal when an htmx request fails.
 * Use this controller on a Dialog element.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initSendErrorDialog(dlg: Element) {
    if (!(dlg instanceof HTMLDialogElement)) return

    document.body.addEventListener('htmx:error', () => {
      dlg.showModal()
    })
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-send-error-dialog', initSendErrorDialog)
  })

})()
