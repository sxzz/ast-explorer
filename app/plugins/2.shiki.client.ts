import { shikiToMonaco } from '@shikijs/monaco'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import themeDark from 'shiki/themes/dark-plus.mjs'
import themeLight from 'shiki/themes/light-plus.mjs'
import { shikiLangs } from '~/composables/shiki'
import type * as Monaco from 'monaco-editor'

export default defineNuxtPlugin(async () => {
  const monaco: typeof Monaco = await useMonaco()
  monaco.languages.register({ id: 'vue' })
  monaco.languages.register({ id: 'svelte' })
  monaco.languages.register({ id: 'astro' })
  monaco.languages.register({ id: 'solidity' })
  monaco.languages.register({ id: 'protobuf' })
  monaco.languages.register({ id: 'bash' })

  const highlighter = createHighlighterCoreSync({
    themes: [themeDark, themeLight],
    langs: shikiLangs,
    engine: createJavaScriptRegexEngine(),
  })
  shikiToMonaco(highlighter, monaco)
})
