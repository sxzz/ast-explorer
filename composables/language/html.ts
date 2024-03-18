import type * as Htmlparser2 from 'htmlparser2'
import type { LanguageOption, Parser } from '../language'

// @unocss-include

const htmlparser2: Parser<typeof Htmlparser2, Htmlparser2.Options> = {
  id: 'htmlparser2',
  label: 'htmlparser2',
  icon: 'i-vscode-icons:file-type-html',
  link: 'https://feedic.com/htmlparser2/',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: 'return {}',
    editorLanguage: 'javascript',
    defaultValueType: 'javascript',
  },
  // @ts-expect-error
  init: () => import('https://cdn.jsdelivr.net/npm/htmlparser2@9.1.0/+esm'),
  version: fetchVersion('htmlparser2'),
  parse(code, options) {
    return this.parseDocument(code, options)
  },
}

export const html: LanguageOption = {
  label: 'HTML',
  icon: 'i-vscode-icons:file-type-html',
  parsers: [htmlparser2],
}
