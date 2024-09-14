import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki'
import langCss from 'shiki/langs/css.mjs'
import langHtml from 'shiki/langs/html.mjs'
import langJson from 'shiki/langs/json.mjs'
import langTs from 'shiki/langs/typescript.mjs'
import langVue from 'shiki/langs/vue.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'

export const shikiLangs = [langTs, langVue, langJson, langHtml, langCss]
export const highlighter = createHighlighterCoreSync({
  langs: shikiLangs,
  themes: [vitesseLight, vitesseDark],
  engine: createJavaScriptRegexEngine(),
})

const highlight = useMemoize((code: string, theme: string) => {
  return highlighter.codeToTokens(code, {
    lang: 'typescript',
    theme,
  })
})

export function useHighlightColor(
  content: MaybeRefOrGetter<string | undefined>,
) {
  return computed(() => {
    const code = toValue(content)
    if (code == null) return ''
    const theme = `vitesse-${isDark.value ? 'dark' : 'light'}`
    const result = highlight(code, theme)
    let idx = 0
    if (code.startsWith('"')) {
      idx = 1
    }
    return result.tokens[0][idx].color
  })
}
