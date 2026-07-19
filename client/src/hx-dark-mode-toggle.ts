/*
 * Toggle .light and .dark classes on the document body when clicked.
 */
(function () {
    'use strict'

    htmx.defineExtension('dark-mode-toggle', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const elt = evt.detail.elt as HTMLElement
                elt.addEventListener('click', () => {
                    document.body.classList.toggle('light')
                    document.body.classList.toggle('dark')
                })
            }
        }
    })
})()
