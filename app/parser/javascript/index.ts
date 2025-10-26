import { javascriptTemplate } from '../template'
import type { LanguageOption } from '..'
import { acorn, acornLoose } from './acorn'
import { babel } from './babel'
import { espree, tsEslint } from './eslint'
import { esprimaNext } from './esprima-next'
import { flow } from './flow'
import { hermes } from './hermes'
import { meriyah } from './meriyah'
import { oxc } from './oxc'
import { swc } from './swc'
import { typescript } from './typescript'
import { arkts } from './arkts'

export const javascript: LanguageOption = {
  label: 'JavaScript',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: [
    babel,
    swc,
    oxc,
    acorn,
    acornLoose,
    typescript,
    arkts,
    espree,
    tsEslint,
    esprimaNext,
    flow,
    hermes,
    meriyah,
  ],
  codeTemplate: javascriptTemplate,
}
