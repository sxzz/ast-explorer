import json5 from 'json5'
import type { LanguageOption, Parser } from './index'

const jsonAst: Parser = {
  id: 'json-ast',
  label: 'JSON AST',
  // @unocss-include
  icon: 'i-ri:braces-line',
  editorLanguage: 'json',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: '',
  init: () => {},
  parse(code) {
    return json5.parse(code || '{}')
  },
}

export const general: LanguageOption = {
  label: 'General',
  icon: 'i-ri:code-line',
  parsers: [jsonAst, treeSitter],
  codeTemplate: JSON.stringify(
    {
      type: 'Program',
      body: [{ type: 'ExpressionStatement' }],
    },
    undefined,
    2,
  ),
}
