/*
 * Perform click on html element when Enter is typed.
 * Use this on a focusable element.
 */
(function () {
  'use strict'

  htmx.defineExtension('click-with-enter', {
    onEvent: function (name: string, evt: CustomEvent) {
      if (name === "htmx:afterProcessNode") {
        const elt = evt.detail.elt as HTMLElement

        elt.addEventListener('keyup', (ev: KeyboardEvent) => {
          if (ev.key === 'Enter') {
            elt.click()
          }
        })
      }
    }
  })
})()
