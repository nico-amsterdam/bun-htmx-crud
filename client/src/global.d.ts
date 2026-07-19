declare const htmx: {
    defineExtension: (name: string, definition: {
        onEvent: (name: string, evt: CustomEvent) => void
    }) => void
}
