import type { Parser } from '..'
import type * as TsEslint from '@typescript-eslint/parser'
import type * as Espree from 'espree'

export const espree: Parser<typeof Espree, Espree.Options> = {
  id: 'espree',
  label: 'espree',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-eslint',
  link: 'https://github.com/eslint/espree',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      loc: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'espree',
  getModuleUrl: (pkg) => `https://cdn.skypack.dev/${pkg}?min`,
  async version() {
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'javascript',
  getAstLocation,
  gui: () => import('./EslintEspreeGui.vue'),
}

export const tsEslint: Parser<
  Pick<typeof TsEslint, 'parse' | 'version'>,
  TsEslint.ParserOptions
> = {
  id: 'typescript-eslint',
  label: '@typescript-eslint/parser',
  icon: 'https://cdn.jsdelivr.net/gh/typescript-eslint/typescript-eslint@main/packages/website/static/img/logo.svg',
  link: 'https://typescript-eslint.io/packages/parser/',
  options: {
    configurable: true,
    defaultValue: {
      ecmaVersion: 'latest',
    },
    editorLanguage: 'json',
  },
  pkgName: '@typescript-eslint/parser',
  init: () => import('#build/ts-eslint-parser'),
  async version() {
    return (await this).version
  },
  versionOverridable: false,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  editorLanguage: 'typescript',
  getAstLocation: genGetAstLocation('range'),
  gui: () =>
    import('./EslintEspreeGui.vue').then(
      (mod) => () => h(mod.default, { typescript: true }),
    ),
}
