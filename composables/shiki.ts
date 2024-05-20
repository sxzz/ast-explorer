import type { HighlighterCore } from 'shiki'

const highlighterPromise = getShikiHighlighter()

let highlighter: HighlighterCore
const highlight = useMemoize(async (code: string, theme: string) => {
  highlighter ||= await highlighterPromise
  return highlighter.codeToTokens(code, {
    lang: 'javascript',
    theme,
  })
})

export function useHighlightColor(
  content: MaybeRefOrGetter<string | undefined>,
) {
  return useAsyncState(async () => {
    const code = toValue(content)
    if (code == null) return ''
    const theme = `vitesse-${isDark.value ? 'dark' : 'light'}`
    const result = await highlight(code, theme)
    let idx = 0
    if (code.startsWith('"')) {
      idx = 1
    }
    return result.tokens[0][idx].color
  }, undefined).state
}
