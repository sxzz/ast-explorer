import type { LanguageOption, Parser } from './index'
import type * as CssTree from 'css-tree'
import type * as Postcss from 'postcss'

// @unocss-include

const cssTree: Parser<typeof CssTree, CssTree.ParseOptions> = {
  id: 'csstree',
  label: 'csstree',
  icon: 'i-vscode-icons:file-type-css',
  link: 'https://github.com/csstree/csstree',
  editorLanguage: 'css',
  options: {
    configurable: true,
    defaultValue: {
      positions: true,
    },
    editorLanguage: 'json',
    defaultValueType: 'json5',
  },
  pkgName: 'css-tree',
  init: (pkg) =>
    importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/dist/csstree.esm.js`),
  async version() {
    // @ts-expect-error missing property
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  getAstLocation: getAstLocation('cssTree'),
}

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
  init: (pkgName) => importUrl(`https://esm.sh/${pkgName}`),
  version: fetchVersion,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
}

export const css: LanguageOption = {
  label: 'CSS',
  icon: 'i-vscode-icons:file-type-css',
  parsers: [cssTree, postcss],
}
