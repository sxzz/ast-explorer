import { markdownTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Remark from 'remark'
// @unocss-include

const remarkAst: Parser<typeof Remark> = {
  id: 'remark',
  label: 'remark',
  icon: 'https://avatars.githubusercontent.com/u/16309564',
  link: 'https://github.com/remarkjs/remark',
  editorLanguage: 'markdown',
  options: {
    configurable: true,
    defaultValue: `return {}`,
    editorLanguage: 'javascript',
    defaultValueType: 'javascript',
  },
  pkgName: 'remark',
  init: (pkg) => importJsdelivr(pkg),
  version: fetchVersion,
  parse(code) {
    return this.remark().parse(code)
  },
  getAstLocation: genGetAstLocation('remark'),
}

export const markdown: LanguageOption = {
  label: 'MARKDOWN',
  icon: 'i-vscode-icons:file-type-markdown',
  parsers: [remarkAst],
  codeTemplate: markdownTemplate,
}
