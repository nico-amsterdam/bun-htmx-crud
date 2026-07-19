/*
 * Close a dialog element.
 * On a dialog itself: closes when the backdrop is clicked (target === dialog).
 * On a child element: specify the dialog selector via data-dialog.
 */
(function () {
    'use strict'

    htmx.defineExtension('dialog-close', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const elt = evt.detail.elt as HTMLElement
                const dialogSelector = elt.getAttribute('data-dialog')

                elt.addEventListener('click', (ev) => {
                    if (dialogSelector) {
                        const dlg = document.querySelector(dialogSelector) as HTMLDialogElement | null
                        dlg?.close()
                    } else if (elt instanceof HTMLDialogElement && ev.target === elt) {
                        elt.close()
                    }
                })
            }
        }
    })
})()
