import { emberTemplate } from './template'
import type { LanguageOption, Parser } from './index'

export const emberEstreeGJS: Parser<typeof Espree, Espree.Options> = {
  id: 'ember-estree-gjs',
  label: 'ember-estree (GJS)',
  icon: 'i-vscode-icons:file-type-ember',
  link: 'https://github.com/emberjs/ember.js',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'ember-estree',
  getModuleUrl: (pkg) =>
    `https://esm.sh/${pkg}@0.6.3?bundle&target=esnext&exports=parse`,
  parse(code, options) {
    const result = this.parse(code, {
      ...options,
      filePath: 'ast-explorer.gjs',
      templateOnly: false,
    })

    return result.program
  },
  editorLanguage: 'glimmer-js',
  getNodeLocation,
}

export const emberEstreeGTS: Parser<typeof Espree, Espree.Options> = {
  id: 'ember-estree-gts',
  label: 'ember-estree (GTS)',
  icon: 'i-vscode-icons:file-type-ember',
  link: 'https://github.com/emberjs/ember.js',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'ember-estree',
  getModuleUrl: (pkg) =>
    `https://esm.sh/${pkg}@0.6.3?bundle&target=esnext&exports=parse`,
  parse(code, options) {
    const result = this.parse(code, {
      ...options,
      filePath: 'ast-explorer.gts',
      templateOnly: false,
    })

    return result.program
  },
  editorLanguage: 'glimmer-ts',
  getNodeLocation,
}

export const ember: LanguageOption = {
  label: 'Ember',
  icon: 'i-vscode-icons:file-type-ember',
  parsers: [emberEstreeGJS, emberEstreeGTS],
  codeTemplate: emberTemplate,
}
