/*
 * Toggle the #noResults element based on whether #search-results has rows.
 * Use this on a table element; it listens for htmx:afterSwap events.
 */
(function () {
    'use strict'

    htmx.defineExtension('toggle-no-results', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const elt = evt.detail.elt as HTMLElement

                elt.addEventListener('htmx:afterSwap', () => {
                    const searchResults = document.getElementById('search-results')
                    const noResults = document.getElementById('noResults')
                    if (!searchResults || !noResults) return

                    if (searchResults.querySelector('tr')) {
                        noResults.classList.add('hide')
                    } else {
                        noResults.classList.remove('hide')
                    }
                })
            }
        }
    })
})()
