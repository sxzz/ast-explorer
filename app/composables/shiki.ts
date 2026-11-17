import type { HighlighterCore } from 'shiki/core'

export const shikiTheme = computed(() =>
  isDark.value ? 'vitesse-dark' : 'vitesse-light',
)

/** Available once its chunk has loaded; see {@link loadHighlighter}. */
export const highlighter = shallowRef<HighlighterCore>()

let highlighterModule:
  Promise<typeof import('~/monaco/highlighter')> | undefined
function importHighlighter() {
  return (highlighterModule ||= import('~/monaco/highlighter'))
}

let highlighterPromise: Promise<HighlighterCore> | undefined
export function loadHighlighter(): Promise<HighlighterCore> {
  return (highlighterPromise ||= importHighlighter().then(
    ({ createHighlighter }) => (highlighter.value = createHighlighter()),
  ))
}

/** Grammars are split per language and loaded on first use. */
export async function loadGrammar(language: MonacoLanguage): Promise<void> {
  const [{ loadGrammar }, highlighter] = await Promise.all([
    importHighlighter(),
    loadHighlighter(),
  ])
  await loadGrammar(highlighter, language)
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
