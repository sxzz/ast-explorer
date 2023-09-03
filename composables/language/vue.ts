import { type LanguageOption, type Parser } from '../language'
import type * as Vue3Sfc from '@vue/compiler-sfc'

// @unocss-include

const vue3: Parser<typeof Vue3Sfc, Vue3Sfc.SFCParseOptions> = {
  id: 'vue3',
  label: '@vue/compiler-sfc',
  icon: 'i-vscode-icons:file-type-vue',
  version: `@vue/compiler-sfc@3`,
  editorLanguage: 'vue',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  init() {
    return import(
      // @ts-expect-error
      'https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@3/dist/compiler-sfc.esm-browser.js'
    )
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
}

export const vue: LanguageOption = {
  label: 'Vue',
  icon: 'i-vscode-icons:file-type-vue',
  parsers: [vue3],
}
