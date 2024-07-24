import { shikiToMonaco } from '@shikijs/monaco'
import { createHighlighterCore } from 'shiki'
import langCss from 'shiki/langs/css.mjs'
import langHtml from 'shiki/langs/html.mjs'
import langJson from 'shiki/langs/json.mjs'
import langTs from 'shiki/langs/typescript.mjs'
import langVue from 'shiki/langs/vue.mjs'
import themeDark from 'shiki/themes/dark-plus.mjs'
import themeLight from 'shiki/themes/light-plus.mjs'

export default defineNuxtPlugin(async () => {
  const monaco = useMonaco()!

  monaco.languages.register({ id: 'vue' })
  const highlighter = await createHighlighterCore({
    themes: [themeDark, themeLight],
    langs: [langJson, langHtml, langCss, langVue, langTs],
    loadWasm: import('shiki/wasm'),
  })
  shikiToMonaco(highlighter, monaco)
})
