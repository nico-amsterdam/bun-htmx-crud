/**
 * Trigger an initial server search when an input is processed.
 * Use this on an input element
 * The `data-server-search` attribute must specify the event name.
 * In the `hx-trigger` the event can be used to trigger the search.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initServerSearch(input: Element) {
    const eventName = input.getAttribute('data-server-search')
    if (!eventName) return
    // Trigger initial search
    input.dispatchEvent(new Event(eventName))
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-server-search', initServerSearch)
  })

})()
