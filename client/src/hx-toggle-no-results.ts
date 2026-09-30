/**
 * Toggle element based on whether `hx-target` has `<tr>` rows.
 * Must be put on the element initiating the swap (look for the `hx-get`).
 * It listens for `htmx:after:swap` events.
 * The `data-toggle-no-results` attribute must have the element id of
 * the element to hide/show.
 * `hx-target` should contain a selector for the element with/without `<tr>` elements.
 */
(function () {
  'use strict'

  htmx.registerExtension('toggle-no-results', {
    htmx_after_init: function (elt: HTMLElement) {
      const noResultsId = elt.getAttribute('data-toggle-no-results')
      if (!noResultsId) return
      const searchResultsElm = elt.getAttribute('hx-target');
      if (!searchResultsElm) return

      elt.addEventListener('htmx:after:swap', () => {
        const searchResults = document.querySelector(searchResultsElm)
        const noResults = document.getElementById(noResultsId)
        if (!searchResults || !noResults) return

        if (searchResults.querySelector('tr')) {
          noResults.classList.add('hide')
        } else {
          noResults.classList.remove('hide')
        }
      })
    }
  })
})()
