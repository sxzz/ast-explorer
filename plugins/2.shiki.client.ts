import { shikiToMonaco } from '@shikijs/monaco'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import themeDark from 'shiki/themes/dark-plus.mjs'
import themeLight from 'shiki/themes/light-plus.mjs'
import { shikiLangs } from '~/composables/shiki'

export default defineNuxtPlugin(() => {
  const monaco = useMonaco()!
  monaco.languages.register({ id: 'vue' })
  monaco.languages.register({ id: 'svelte' })
  monaco.languages.register({ id: 'rust' })
  monaco.languages.register({ id: 'solidity' })

  const highlighter = createHighlighterCoreSync({
    themes: [themeDark, themeLight],
    langs: shikiLangs,
    engine: createJavaScriptRegexEngine(),
  })
  shikiToMonaco(highlighter, monaco)
})
