import { parse, version } from '@vue/compiler-sfc'
import { type LanguageOption } from '../language'

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
  version: `@vue/compiler-sfc@${version}`,
  parse(code, options) {
    return parse(code, { ...options })
  },
}
