import { emberTemplate } from './template'
import type { LanguageOption, Parser } from './index'

export const emberEstree: Parser<typeof Espree, Espree.Options> = {
  id: 'ember-estree',
  label: 'ember-estree',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-ember',
  link: 'https://github.com/emberjs/ember.js',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'ember-estree',
  getModuleUrl: (pkg) => `https://cdn.skypack.dev/${pkg}?min`,
  async version() {
    return (await this).version
  },
  parse(code, options) {
    console.log(this)
    return this.toTree(code, { ...options }).ast
  },
  editorLanguage: 'Glimmer JS',
  getNodeLocation,
}

export const ember: LanguageOption = {
  label: 'Ember',
  icon: 'i-vscode-icons:file-type-ember',
  parsers: [emberEstree],
  codeTemplate: emberTemplate,
}
