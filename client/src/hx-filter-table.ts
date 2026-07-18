/*
 * Filter elements in a table based on a search field.
 */
(function () {
    'use strict'

    htmx.defineExtension('filter-table', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const elt = evt.detail.elt as HTMLElement

                // TODO
            }
        }
    })

})()