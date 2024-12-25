import { cssTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as CssTree from 'css-tree'
import type * as Lightningcss from 'lightningcss-wasm'
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
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/dist/csstree.esm.js`),
  async version() {
    // @ts-expect-error missing property
    return (await this).version
  },
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  getAstLocation: genGetAstLocation('locOffset'),
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
  getModuleUrl: (pkgName) => `https://esm.sh/${pkgName}`,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
}

const lightningcss: Parser<
  typeof Lightningcss,
  Omit<Lightningcss.TransformOptions<{}>, 'code'>
> = {
  id: 'lightningcss',
  label: 'Lightning CSS',
  icon: 'https://raw.githubusercontent.com/parcel-bundler/lightningcss/7f290350ed0cc53b1267d6810417f0611135eeee/website/favicon.svg',
  link: 'https://lightningcss.dev/',
  editorLanguage: 'css',
  options: {
    configurable: true,
    defaultValue: {
      filename: 'input.css',
    },
    editorLanguage: 'javascript',
    defaultValueType: 'json5',
  },
  pkgName: 'lightningcss-wasm',
  getModuleUrl: (pkgName) => `https://esm.sh/${pkgName}`,
  async parse(code, options) {
    await this.default()

    const encoder = new TextEncoder()
    let result!: Lightningcss.StyleSheet
    this.transform({
      ...options,
      code: encoder.encode(code),
      visitor: {
        StyleSheet(stylesheet) {
          result = stylesheet
        },
      },
    })
    return result
  },
}

export const css: LanguageOption = {
  label: 'CSS',
  icon: 'i-vscode-icons:file-type-css',
  parsers: [cssTree, postcss, lightningcss],
  codeTemplate: cssTemplate,
}
