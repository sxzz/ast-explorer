import { javascriptTemplate } from '../template'
import { acorn, acornLoose } from './acorn'
import { babel } from './babel'
import { espree, tsEslint } from './eslint'
import { esprimaNext } from './esprima-next'
import { flow } from './flow'
import { gofast } from './gofast'
import { hermes } from './hermes'
import { meriyah } from './meriyah'
import { ohosTypescript } from './ohos-typescript'
import { oxc } from './oxc'
import { swc } from './swc'
import { typescript } from './typescript'
import type { LanguageOption } from '..'

export const javascript: LanguageOption = {
  label: 'JavaScript',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-js-official',
  parsers: [
    babel,
    oxc,
    swc,
    acorn,
    acornLoose,
    typescript,
    espree,
    tsEslint,
    esprimaNext,
    flow,
    hermes,
    meriyah,
    ohosTypescript,
    gofast,
  ],
  codeTemplate: javascriptTemplate,
}
