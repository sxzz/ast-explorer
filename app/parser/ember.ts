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
    editorLanguage: 'json',
  },
  pkgName: 'ember-estree',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}@0.6.3?bundle&target=esnext`,
  parse(code, options) {
    const result = this.parse(code, { ...options })

    console.log(result)

    return result.program
  },
  editorLanguage: 'glimmer-js',
  getNodeLocation,
}

export const ember: LanguageOption = {
  label: 'Ember',
  icon: 'i-vscode-icons:file-type-ember',
  parsers: [emberEstree],
  codeTemplate: emberTemplate,
}
