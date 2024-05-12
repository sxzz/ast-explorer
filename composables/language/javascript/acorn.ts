import type { Parser } from '..'
import type * as Acorn from 'acorn'

export const acorn: Parser<typeof Acorn, Acorn.Options> = {
  id: 'acorn',
  label: 'Acorn',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-js-official',
  link: 'https://github.com/acornjs/acorn',
  options: {
    configurable: true,
    defaultValue: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    editorLanguage: 'json',
  },
  pkgName: 'acorn',
  init: (pkg) =>
    importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/dist/acorn.mjs`),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getAstLocation: getAstLocationBabel,
}
