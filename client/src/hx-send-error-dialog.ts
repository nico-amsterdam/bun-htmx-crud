(function () {
    'use strict'

    htmx.defineExtension('send-error-dialog', {
        onEvent: function (name: string, evt: CustomEvent) {
            if (name === "htmx:afterProcessNode") {
                const dlg = evt.detail.elt as HTMLDialogElement

                document.body.addEventListener("htmx:sendError", (evt) => {
                    dlg.showModal();
                });

            }
        }
    })
})()
