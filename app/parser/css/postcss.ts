import { genGetNodeLocation } from '~/composables/location'
import type { Parser } from '..'
import type * as Postcss from 'postcss'

const postcss: Parser<typeof Postcss, Postcss.ProcessOptions> = {
  id: 'postcss',
  label: 'postcss',
  icon: 'i-vscode-icons:file-type-postcss',
  link: 'https://postcss.org/',
  editorLanguage: 'css',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
    defaultValueType: 'json5',
  },
  pkgName: 'postcss',
  getModuleUrl: (pkgId) => `https://esm.sh/${pkgId}`,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  getNodeLocation: genGetNodeLocation('postcss'),
  hideKeys: ['parent'],
}

const postcssScss: Parser<typeof Postcss, Postcss.ProcessOptions> = {
  ...postcss,
  id: 'postcss-scss',
  label: 'postcss-scss',
  link: 'https://github.com/postcss/postcss-scss',
  editorLanguage: 'scss',
  pkgName: 'postcss-scss',
  icon: 'i-vscode-icons:file-type-scss',
  getModuleUrl: (pkgId) => `https://esm.sh/${pkgId}`,
}

const postcssLess: Parser<typeof Postcss, Postcss.ProcessOptions> = {
  ...postcss,
  id: 'postcss-less',
  label: 'postcss-less',
  link: 'https://github.com/prettier/postcss-less',
  editorLanguage: 'less',
  pkgName: 'postcss-less',
  icon: 'i-vscode-icons:file-type-less',
  getModuleUrl: (pkgId) => `https://esm.sh/${pkgId}`,
}

export { postcss, postcssLess, postcssScss }
