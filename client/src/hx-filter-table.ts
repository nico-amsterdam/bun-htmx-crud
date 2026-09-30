/**
 * Filter elements in a table based on a search field.
 * Add/removes the 'hide' class to hide/show elements.
 * Place the controller on a top element with `data-filter-table="true"`
 * On the input element specify `data-filter-table-target="input"`,
 * and add `data-filter-table-target="filter"` to the element with <tr> search-results
 * When there are no matches, the elements with `data-filter-table-target="noResults"`
 * will be shown.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initFilter(controller: Element) {
    const input = controller.querySelector('[data-filter-table-target="input"]')
    if (!(input instanceof HTMLInputElement)) return

    const searchResultsElements = controller.querySelector('[data-filter-table-target="filter"]')
    if (!searchResultsElements) return
    const noResultsElements = controller.querySelectorAll('[data-filter-table-target="noResults"]')

    const filter = () => {
      const q = input.value.toLowerCase().trim()
      let matchCount = 0
      const rows = searchResultsElements.querySelectorAll('tr')
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
        noResultsElements.forEach((elm) => { elm.classList.remove('hide') });
      } else {
        noResultsElements.forEach((elm) => { elm.classList.add('hide') });
      }
    }

    // Run filter on load and on input
    filter()
    input.addEventListener('input', filter)
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-filter-table', initFilter)
  })
})()
