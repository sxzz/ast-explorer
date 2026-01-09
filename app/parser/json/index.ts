import { jsonTemplate } from '../template'
import { jsonToAst } from './json-to-ast'
import { jsoncEslintParser } from './jsonc-eslint-parser'
import { momoa } from './momoa'
import { typescript } from './typescript'
import type { LanguageOption } from '..'

export const json: LanguageOption = {
  label: 'JSON',
  icon: 'i-vscode-icons:file-type-json',
  parsers: [jsonToAst, momoa, jsoncEslintParser, typescript],
  codeTemplate: jsonTemplate,
}
