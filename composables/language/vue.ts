import { parse, version } from '@vue/compiler-sfc'
import { type LanguageOption } from '../language'

// @unocss-include
export const vue: LanguageOption = {
  label: 'Vue',
  icon: 'i-vscode-icons:file-type-vue',
  parsers: {
    vue3: {
      id: 'vue3',
      label: '@vue/compiler-sfc (Vue 3)',
      icon: 'i-vscode-icons:file-type-vue',
      version: `@vue/compiler-sfc@${version}`,
      options: {
        configurable: true,
        defaultValue: {},
        editorLanguage: 'json',
      },
      parse(code, options) {
        return parse(code, { ...options })
      },
      editorLanguage: 'vue',
    },
  },
}
