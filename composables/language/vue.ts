import { type LanguageOption, type Parser } from '../language'
import type * as Vue3Sfc from '@vue/compiler-sfc'

// @unocss-include

const vue3: Parser<typeof Vue3Sfc, Vue3Sfc.SFCParseOptions> = {
  id: 'vue3',
  label: '@vue/compiler-sfc',
  icon: 'i-vscode-icons:file-type-vue',
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
  async version() {
    return `@vue/compiler-sfc@${(await this).version}`
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
}

const vue3ScriptSetup: Parser<
  typeof Vue3Sfc,
  { parse?: Vue3Sfc.SFCParseOptions; compile: Vue3Sfc.SFCScriptCompileOptions }
> = {
  ...vue3,
  id: 'vue3-script-setup',
  label: '@vue/compiler-sfc (script setup)',
  editorLanguage: 'vue',
  options: {
    configurable: true,
    defaultValue: {
      parse: {},
      compile: {
        id: 'foo.vue',
      },
    },
    editorLanguage: 'json',
  },
  parse(code, options) {
    const result = { ...this.parse(code, { ...options.parse }) }
    result.descriptor = { ...result.descriptor }
    result.descriptor.scriptSetup = this.compileScript(result.descriptor, {
      ...options.compile,
    })
    return result
  },
}

export const vue: LanguageOption = {
  label: 'Vue',
  icon: 'i-vscode-icons:file-type-vue',
  parsers: [vue3, vue3ScriptSetup],
}
