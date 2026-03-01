import { shellTemplate } from './template'
import type { LanguageOption } from './index'
import type * as Unbash from 'unbash'

const unbash: Parser<typeof Unbash> = {
  id: 'unbash',
  label: 'unbash',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-shell',
  link: 'https://github.com/webpro-nl/unbash',
  editorLanguage: 'bash',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
    defaultValueType: 'json5',
  },
  pkgName: 'unbash',
  parse(code) {
    return this.parse(code)
  },
  getNodeLocation: genGetNodeLocation('unbash'),
}

export const shell: LanguageOption = {
  label: 'Shell',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-shell',
  parsers: [unbash, treeSitterBash],
  codeTemplate: shellTemplate,
}
