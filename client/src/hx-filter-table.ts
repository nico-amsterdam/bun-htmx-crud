/*
 * Filter elements in a table based on a search field.
 * Use this on an input element alongside the preserve-input extension.
 * It filters rows in #search-results and toggles #noResults visibility.
 */
(function () {
    'use strict'

    htmx.defineExtension('filter-table', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const input = evt.detail.elt as HTMLInputElement
                const searchResults = document.getElementById('search-results')
                const noResults = document.getElementById('noResults')

                if (!searchResults || !noResults) return

                const filter = () => {
                    const q = input.value.toLowerCase().trim()
                    let matchCount = 0
                    const rows = searchResults.querySelectorAll('tr')
                    rows.forEach((row) => {
                        const cells = row.children
                        const nameText = cells[0]?.textContent?.toLowerCase() || ''
                        const descText = cells[1]?.textContent?.toLowerCase() || ''
                        const priceText = cells[2]?.textContent || ''
                        if (nameText.includes(q) || descText.includes(q) || priceText.includes(q)) {
                            row.classList.remove('hide')
                            matchCount++
                        } else {
                            row.classList.add('hide')
                        }
                    })

                    if (matchCount === 0) {
                        noResults.classList.remove('hide')
                    } else {
                        noResults.classList.add('hide')
                    }
                }

                // Run filter on load and on input
                filter()
                input.addEventListener('input', filter)
            }
        }
    })
})()
