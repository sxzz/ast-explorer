import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki'
import langAngularHtml from 'shiki/langs/angular-html.mjs'
import langAstro from 'shiki/langs/astro.mjs'
import langCsharp from 'shiki/langs/csharp.mjs'
import langCss from 'shiki/langs/css.mjs'
import langGraphql from 'shiki/langs/graphql.mjs'
import langHtml from 'shiki/langs/html.mjs'
import langJava from 'shiki/langs/java.mjs'
import langJson from 'shiki/langs/json.mjs'
import langMarkdown from 'shiki/langs/markdown.mjs'
import langPhp from 'shiki/langs/php.mjs'
import langProtobuf from 'shiki/langs/protobuf.mjs'
import langPython from 'shiki/langs/python.mjs'
import langRust from 'shiki/langs/rust.mjs'
import langSolidity from 'shiki/langs/solidity.mjs'
import langSql from 'shiki/langs/sql.mjs'
import langSvelte from 'shiki/langs/svelte.mjs'
import langTs from 'shiki/langs/typescript.mjs'
import langVue from 'shiki/langs/vue.mjs'
import langYaml from 'shiki/langs/yaml.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'

/// keep-sorted
export const shikiLangs = [
  langAngularHtml,
  langAstro,
  langCsharp,
  langCss,
  langGraphql,
  langHtml,
  langJava,
  langJson,
  langMarkdown,
  langPhp,
  langProtobuf,
  langPython,
  langRust,
  langSolidity,
  langSql,
  langSvelte,
  langTs,
  langVue,
  langYaml,
]
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
    const token = result.tokens[0]!
    const idx = (code[0] === '"' || code[0] === '/') && token.length > 1 ? 1 : 0
    return token[idx]!.color
  })
}
