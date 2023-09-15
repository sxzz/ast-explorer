import parse from 'json-to-ast'
import { version } from 'json-to-ast/package.json'
import { type LanguageOption, type Parser } from '../language'

// @unocss-include

const jsonToAst: Parser<undefined, parse.Options> = {
  id: 'json-to-ast',
  label: 'json-to-ast',
  icon: 'i-vscode-icons:file-type-json',
  editorLanguage: 'json',
  options: {
    configurable: true,
    defaultValue: {
      loc: false,
    },
    editorLanguage: 'json',
  },
  version,
  parse(code, options) {
    return parse(code, options)
  },
}

export const json: LanguageOption = {
  label: 'JSON',
  icon: 'i-vscode-icons:file-type-json',
  parsers: [jsonToAst],
}
