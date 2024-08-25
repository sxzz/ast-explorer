import { jsonTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type parse from 'json-to-ast'

// @unocss-include

const jsonToAst: Parser<typeof parse, parse.Options> = {
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
  version: fetchVersion,
  async init(pkg) {
    const mod = await importJsdelivr(pkg)
    return mod.default
  },
  parse(code, options) {
    return this(code, { ...options })
  },
  getAstLocation: genGetAstLocation('locOffset'),
}

export const json: LanguageOption = {
  label: 'JSON',
  icon: 'i-vscode-icons:file-type-json',
  parsers: [jsonToAst],
  codeTemplate: jsonTemplate,
}
