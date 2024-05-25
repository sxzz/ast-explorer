import { javascriptTemplate } from '../template'
import { babel } from './babel'
import { swc } from './swc'
import { oxc } from './oxc'
import { acorn } from './acorn'
import { espree, tsEslint } from './eslint'
import { typescript } from './typescript'
import { flow } from './flow'
import { hermes } from './hermes'
import type { LanguageOption } from '..'

export const javascript: LanguageOption = {
  label: 'JavaScript',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: [babel, swc, oxc, acorn, typescript, espree, tsEslint, flow, hermes],
  codeTemplate: javascriptTemplate,
}
