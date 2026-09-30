declare const htmx: {
  registerExtension: (name: string, definition: Record<string, unknown>) => void
  onLoad: (callback: (elt: Element) => void) => void
}
