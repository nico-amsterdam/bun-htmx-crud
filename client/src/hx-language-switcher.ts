/**
 * Navigate to a language-specific URL when a select element changes.
 * Specify the base URL via attribute data-language-switcher-base-url.
 */
import { forEachElementOnce } from './hx-extension-helpers'

(function () {
  'use strict'

  function initLanguageSwitcher(select: Element) {
    if (!(select instanceof HTMLSelectElement)) return
    const baseUrl = select.getAttribute('data-language-switcher-base-url')
    if (!baseUrl) return

    select.addEventListener('change', () => {
      const lang = select.value
      if (lang === 'en') {
        window.location.href = baseUrl
      } else {
        window.location.href = `${baseUrl}?lang=${lang}`
      }
    })
  }

  htmx.onLoad((elt) => {
    forEachElementOnce(elt, 'data-language-switcher', initLanguageSwitcher)
  })
})()
