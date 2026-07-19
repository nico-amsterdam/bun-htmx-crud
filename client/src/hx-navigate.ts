/*
 * Navigate to a URL on click.
 * Specify the URL via a data-navigate attribute.
 */
(function () {
    'use strict'

    htmx.defineExtension('navigate', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const elt = evt.detail.elt as HTMLElement
                const url = elt.getAttribute('data-navigate')
                if (!url) return

                elt.addEventListener('click', () => {
                    window.location.href = url
                })
            }
        }
    })
})()
