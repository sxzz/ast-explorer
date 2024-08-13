import { javascriptTemplate } from '../template'
import type { LanguageOption } from '..'
import { acorn } from './acorn'
import { babel } from './babel'
import { espree, tsEslint } from './eslint'
import { esprimaNext } from './esprima-next'
import { flow } from './flow'
import { hermes } from './hermes'
import { oxc } from './oxc'
import { swc } from './swc'
import { typescript } from './typescript'

export const javascript: LanguageOption = {
  label: 'JavaScript',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: [
    babel,
    swc,
    oxc,
    acorn,
    typescript,
    espree,
    tsEslint,
    esprimaNext,
    flow,
    hermes,
  ],
  codeTemplate: javascriptTemplate,
}
