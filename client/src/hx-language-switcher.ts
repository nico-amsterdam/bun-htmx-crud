/*
 * Navigate to a language-specific URL when a select element changes.
 * Specify the base URL via data-base-url.
 * The selected option value is used as the lang query parameter.
 */
(function () {
    'use strict'

    htmx.defineExtension('language-switcher', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const select = evt.detail.elt as HTMLSelectElement
                const baseUrl = select.getAttribute('data-base-url') || ''

                select.addEventListener('change', () => {
                    const lang = select.value
                    if (lang === 'en') {
                        window.location.href = baseUrl
                    } else {
                        window.location.href = `${baseUrl}?lang=${lang}`
                    }
                })
            }
        }
    })
})()
