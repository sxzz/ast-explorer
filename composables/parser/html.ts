import { htmlTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Htmlparser2 from 'htmlparser2'

// @unocss-include

const htmlparser2: Parser<typeof Htmlparser2, Htmlparser2.Options> = {
  id: 'htmlparser2',
  label: 'htmlparser2',
  icon: 'i-vscode-icons:file-type-html',
  link: 'https://feedic.com/htmlparser2/',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: `return { withStartIndices: true, withEndIndices: true }`,
    editorLanguage: 'javascript',
    defaultValueType: 'javascript',
  },
  pkgName: 'htmlparser2',
  init: (pkg) => importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/+esm`),
  version: fetchVersion,
  parse(code, options) {
    return this.parseDocument(code, options)
  },
  getAstLocation: genGetAstLocation('htmlparser2'),
}

export const html: LanguageOption = {
  label: 'HTML',
  icon: 'i-vscode-icons:file-type-html',
  parsers: [htmlparser2],
  codeTemplate: htmlTemplate,
}
