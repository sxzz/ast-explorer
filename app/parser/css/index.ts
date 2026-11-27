import { genGetNodeLocation } from '~/composables/location'
import { getJsdelivrUrl, getModuleVersion } from '~/parser/utils'
import { cssTemplate } from '../template'
import { cssom } from './cssom'
import { postcss, postcssLess, postcssScss } from './postcss'
import type { LanguageOption, Parser } from '..'
import type * as CssTree from 'css-tree'
import type * as Lightningcss from 'lightningcss-wasm'

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
  getModuleUrl: (pkgId) => getJsdelivrUrl(pkgId, `/dist/csstree.esm.js`),
  version: getModuleVersion,
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  getNodeLocation: genGetNodeLocation('locOffset'),
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
  getModuleUrl: (pkgId) => `https://esm.sh/${pkgId}`,
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
  parsers: [cssTree, postcss, postcssScss, postcssLess, lightningcss, cssom],
  codeTemplate: cssTemplate,
}
