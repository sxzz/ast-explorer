import type { HighlighterCore } from 'shiki/core'

export const shikiTheme = computed(() =>
  isDark.value ? 'vitesse-dark' : 'vitesse-light',
)

/** Available once the grammars chunk has loaded; see {@link loadHighlighter}. */
export const highlighter = shallowRef<HighlighterCore>()

let highlighterPromise: Promise<HighlighterCore> | undefined
export function loadHighlighter(): Promise<HighlighterCore> {
  // The grammars are >1 MB, so keep them out of the entry chunk.
  return (highlighterPromise ||= import('~/monaco/highlighter').then(
    ({ createHighlighter }) => (highlighter.value = createHighlighter()),
  ))
}

const highlight = useMemoize((code: string, theme: string) => {
  return highlighter.value!.codeToTokens(code, {
    lang: 'typescript',
    theme,
  })
})

export function useHighlightColor(
  content: MaybeRefOrGetter<string | undefined>,
) {
  return computed(() => {
    const code = toValue(content)
    if (code == null || !highlighter.value) return ''
    const result = highlight(code, shikiTheme.value)
    const token = result.tokens[0]!
    const idx = (code[0] === '"' || code[0] === '/') && token.length > 1 ? 1 : 0
    return token[idx]!.color
  })
}
