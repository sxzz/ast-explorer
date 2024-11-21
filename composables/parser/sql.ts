import { sqlTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as SqlParser from 'sql-parser-cst'

// @unocss-include

const sqlParserCst: Parser<typeof SqlParser, SqlParser.ParserOptions> = {
  id: 'sql-parser-cst',
  label: 'sql-parser-cst',
  icon: 'i-vscode-icons:file-type-sql',
  link: 'https://github.com/nene/sql-parser-cst',
  editorLanguage: 'text',
  options: {
    configurable: true,
    defaultValue: {
      dialect: 'sqlite',
      includeComments: true,
      includeNewlines: true,
      includeSpaces: true,
      includeRange: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'sql-parser-cst',
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  getAstLocation: genGetAstLocation('range'),
}

export const sql: LanguageOption = {
  label: 'SQL',
  icon: 'i-vscode-icons:file-type-sql',
  parsers: [sqlParserCst],
  codeTemplate: sqlTemplate,
}
