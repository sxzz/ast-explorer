import type { Parser } from '..'
import type * as EsprimaNext from 'esprima-next'

export const esprimaNext: Parser<typeof EsprimaNext, EsprimaNext.Config> = {
  id: 'esprima-next',
  label: 'Esprima Next',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-js-official',
  link: 'https://github.com/node-projects/esprima-next',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      range: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'esprima-next',
  init: (pkg) =>
    importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/dist/esprima.js`),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getAstLocation: genGetAstLocation('range'),
}
