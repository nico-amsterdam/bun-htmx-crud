/**
 * Sync an input's value with a hidden field.
 * The hidden field id is read from the `data-preserve-input` attribute.
 * Restores value on init and saves it on blur.
 * Use this alongside `filter-table` or `server-search` on a search input.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initPreserveInput(input: Element) {
    if (!(input instanceof HTMLInputElement)) return
    const stateId = input.getAttribute('data-preserve-input')
    if (!stateId) return

    const stateField = document.getElementById(stateId) as HTMLInputElement | null
    if (!stateField) return

    // Initialize value from state field
    input.value = stateField.value

    // Save value on blur
    input.addEventListener('blur', () => {
      stateField.value = input.value
    })
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-preserve-input', initPreserveInput)
  })
})()
