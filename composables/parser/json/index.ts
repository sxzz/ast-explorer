import { jsonTemplate } from '../template'
import type { LanguageOption } from '..'
import { jsonToAst } from './json-to-ast'
import { momoa } from './momoa'

export const json: LanguageOption = {
  label: 'JSON',
  icon: 'i-vscode-icons:file-type-json',
  parsers: [jsonToAst, momoa],
  codeTemplate: jsonTemplate,
}
