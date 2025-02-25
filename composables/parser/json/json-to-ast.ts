import type { Parser } from '../index'
import type parse from 'json-to-ast'

// @unocss-include

export const jsonToAst: Parser<typeof parse, parse.Options> = {
  id: 'json-to-ast',
  label: 'json-to-ast',
  icon: 'i-vscode-icons:file-type-json',
  link: 'https://github.com/vtrushin/json-to-ast',
  editorLanguage: 'json',
  options: {
    configurable: true,
    defaultValue: {
      loc: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'json-to-ast',
  init: (url) => resolveDefault(importUrl(url)),
  parse(code, options) {
    return this(code, { ...options })
  },
  getNodeLocation: genGetNodeLocation('locOffset'),
}
