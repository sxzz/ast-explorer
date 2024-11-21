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
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'remark',
  parse(code) {
    return this.remark().parse(code)
  },
  getAstLocation: genGetAstLocation('positionOffset'),
}

export const markdown: LanguageOption = {
  label: 'Markdown',
  icon: 'i-vscode-icons:file-type-markdown',
  parsers: [remarkAst],
  codeTemplate: markdownTemplate,
}
