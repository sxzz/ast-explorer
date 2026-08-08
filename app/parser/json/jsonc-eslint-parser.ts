import type { Parser } from '../index'
import type * as JsoncEslintParser from 'jsonc-eslint-parser'

// @unocss-include

export const jsoncEslintParser: Parser<typeof JsoncEslintParser, any> = {
  id: 'jsonc-eslint-parser',
  label: 'jsonc-eslint-parser',
  icon: 'i-vscode-icons:file-type-json',
  link: 'https://github.com/ota-meshi/jsonc-eslint-parser',
  editorLanguage: 'json',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'jsonc-eslint-parser',
  getModuleUrl: (pkgId) => getJsdelivrUrl(pkgId, '/lib/index.mjs'),
  importMap: {
    imports: {
      'eslint-visitor-keys': getJsdelivrUrl('eslint-visitor-keys'),
      'eslint-visitor-keys/': getJsdelivrUrl('eslint-visitor-keys', '/'),
      verkit: getJsdelivrUrl('verkit'),
      acorn: getJsdelivrUrl('acorn'),
      'acorn/': getJsdelivrUrl('acorn', '/'),
    },
  },
  parse(code, options) {
    return this.parseJSON(code, { ...options })
  },
  getNodeLocation: genGetNodeLocation('range'),
  hideKeys: ['parent'],
}
