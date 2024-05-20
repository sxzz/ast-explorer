import { type HighlighterCore, getHighlighterCore } from 'shiki/core'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import javascript from 'shiki/langs/javascript.mjs'
import loadWasm from 'shiki/wasm'

const highlighterPromise = getHighlighterCore({
  themes: [vitesseLight, vitesseDark],
  langs: [javascript],
  loadWasm,
})
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
  return computedAsync(async () => {
    const code = toValue(content)
    if (code == null) return ''
    const theme = `vitesse-${isDark.value ? 'dark' : 'light'}`
    const result = await highlight(code, theme)
    let idx = 0
    if (code.startsWith('"')) {
      idx = 1
    }
    return result.tokens[0][idx].color
  })
}
