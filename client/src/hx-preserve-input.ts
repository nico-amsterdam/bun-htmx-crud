/*
 * Sync an input's value with a hidden field.
 * The hidden field id is read from the data-preserve-input attribute.
 * Restores value on init and saves it on blur.
 * Use this alongside filter-table or server-search on a search input.
 */
(function () {
    'use strict'

    htmx.defineExtension('preserve-input', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const input = evt.detail.elt as HTMLInputElement
                const stateId = input.getAttribute('data-preserve-input')
                const stateField = stateId ? document.getElementById(stateId) as HTMLInputElement | null : null

                // Initialize value from state field
                if (stateField) {
                    input.value = stateField.value
                }

                // Save value on blur
                input.addEventListener('blur', () => {
                    if (stateField) {
                        stateField.value = input.value
                    }
                })
            }
        }
    })
})()
