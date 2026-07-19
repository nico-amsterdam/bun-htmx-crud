/*
 * Trigger an initial server search when an input is processed.
 * Use this on an input element that has hx-trigger including "startsearch",
 * alongside the preserve-input extension.
 */
(function () {
    'use strict'

    htmx.defineExtension('server-search', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const input = evt.detail.elt as HTMLInputElement

                // Trigger initial search
                input.dispatchEvent(new Event('startsearch'))
            }
        }
    })
})()
