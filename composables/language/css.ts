import type * as CssTree from 'css-tree'
import type { LanguageOption, Parser } from '.'

// @unocss-include

const cssTree: Parser<typeof CssTree, CssTree.ParseOptions> = {
  id: 'csstree',
  label: 'csstree',
  icon: 'i-vscode-icons:file-type-css',
  editorLanguage: 'css',
  options: {
    configurable: true,
    defaultValue: {
      positions: true,
    },
    editorLanguage: 'json',
    defaultValueType: 'json5',
  },
  init: () =>
    // @ts-expect-error
    import('https://cdn.jsdelivr.net/npm/css-tree/dist/csstree.esm.js'),
  async version() {
    // @ts-expect-error missing property
    return `css-tree@${(await this).version}`
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  getAstLocation: getAstLocation.bind(null, 'cssTree'),
}

export const css: LanguageOption = {
  label: 'CSS',
  icon: 'i-vscode-icons:file-type-css',
  parsers: [cssTree],
}
