import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import langAngularHtml from 'shiki/langs/angular-html.mjs'
import langAstro from 'shiki/langs/astro.mjs'
import langBash from 'shiki/langs/bash.mjs'
import langCsharp from 'shiki/langs/csharp.mjs'
import langCss from 'shiki/langs/css.mjs'
import langGlimmerJS from 'shiki/langs/glimmer-js.mjs'
import langGlimmerTS from 'shiki/langs/glimmer-ts.mjs'
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
import { themeDark, themeLight } from './theme'

/// keep-sorted
const langs = [
  langAngularHtml,
  langAstro,
  langBash,
  langCsharp,
  langCss,
  langGlimmerJS,
  langGlimmerTS,
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

export function createHighlighter() {
  return createHighlighterCoreSync({
    themes: [themeLight, themeDark],
    langs,
    engine: createJavaScriptRegexEngine(),
  })
}
