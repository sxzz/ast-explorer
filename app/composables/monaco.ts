import type * as Monaco from 'monaco-editor'

/**
 * Set once Monaco and everything registered on top of it (Shiki grammars,
 * formatters, language defaults) is ready. Editors render only after that, so
 * loading Monaco never blocks the rest of the app.
 */
export const loadedMonaco = shallowRef<typeof Monaco>()

let monacoPromise: Promise<typeof Monaco> | undefined
export function loadMonaco(): Promise<typeof Monaco> {
  return (monacoPromise ||= Promise.all([
    useMonaco(),
    loadHighlighter(),
    import('~/monaco/setup'),
  ]).then(([monaco, highlighter, { setupMonaco }]) => {
    setupMonaco(monaco, highlighter)
    return (loadedMonaco.value = monaco)
  }))
}
