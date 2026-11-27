import { genGetNodeLocation } from '~/composables/location'
import { lessTemplate, scssTemplate } from '../template'
import type { Parser } from '..'
import type * as Postcss from 'postcss'

// @unocss-include

// postcss-scss and postcss-less only export `parse` and `stringify`
type PostcssSyntax = Pick<typeof Postcss, 'parse'>

const postcss: Parser<PostcssSyntax, Postcss.ProcessOptions> = {
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

const postcssScss: Parser<PostcssSyntax, Postcss.ProcessOptions> = {
  ...postcss,
  id: 'postcss-scss',
  label: 'postcss-scss',
  icon: 'i-vscode-icons:file-type-scss',
  link: 'https://github.com/postcss/postcss-scss',
  editorLanguage: 'scss',
  pkgName: 'postcss-scss',
  codeTemplate: scssTemplate,
}

const postcssLess: Parser<PostcssSyntax, Postcss.ProcessOptions> = {
  ...postcss,
  id: 'postcss-less',
  label: 'postcss-less',
  icon: 'i-vscode-icons:file-type-less',
  link: 'https://github.com/prettier/postcss-less',
  editorLanguage: 'less',
  pkgName: 'postcss-less',
  codeTemplate: lessTemplate,
}

export { postcss, postcssLess, postcssScss }
