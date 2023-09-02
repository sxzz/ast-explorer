import { LanguageOption } from '../language'
import { parse } from '@vue/compiler-sfc'

// @unocss-include
export const vue: LanguageOption = {
  label: 'Vue',
  icon: 'i-vscode-icons:file-type-vue',
  language: 'vue',
  options: {
    configurable: true,
    defaultValue: {},
    language: 'json',
  },
  parse(code, options) {
    return parse(code, { ...options })
  },
}
