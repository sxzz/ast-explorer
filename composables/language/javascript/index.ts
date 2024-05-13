import { babel } from './babel'
import { swc } from './swc'
import { oxc } from './oxc'
import { acorn } from './acorn'
import { espree, tsEslint } from './eslint'
import { typescript } from './typescript'
import type { LanguageOption } from '..'

export const javascript: LanguageOption = {
  label: 'JavaScript',
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: [babel, swc, oxc, acorn, typescript, espree, tsEslint],
}