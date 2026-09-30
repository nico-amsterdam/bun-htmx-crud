/**
 * Close a dialog element.
 * Dialog closes when the backdrop is clicked (target === dialog).
 * Click on an inner elements with attribute `data-dialog-close-action="close"`
 * also closes the dialog.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initDialogClose(dialogElm: Element) {
    if (!(dialogElm instanceof HTMLDialogElement)) return
    dialogElm.addEventListener('click', (ev) => {
      if (ev.target === dialogElm) dialogElm.close()
    })

    const buttons = dialogElm.querySelectorAll('[data-dialog-close-action="close"]')
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        dialogElm.close()
      })
    })
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-dialog-close', initDialogClose)
  })
})()
