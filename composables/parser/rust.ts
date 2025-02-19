import { rustTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as JinxRust from 'jinx-rust'

// @unocss-include

const syn: Parser<any, any> = {
  id: 'syn',
  label: 'syn',
  icon: 'i-vscode-icons:file-type-rust',
  link: 'https://docs.rs/syn',
  editorLanguage: 'rust',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'astexplorer-syn',
  nodeTitle: '_type',
  init: async (url) => {
    const mod = await importUrl(url)
    await mod.default()
    return mod
  },
  parse(code, options) {
    return this.parseFile(code, { ...options })
  },
}

// jinx-rust
const jinxRust: Parser<typeof JinxRust, JinxRust.rs.ParserOptions> = {
  id: 'jinx-rust',
  label: 'jinx-rust',
  icon: 'i-vscode-icons:file-type-rust',
  link: 'https://github.com/jinxdash/jinx-rust',
  editorLanguage: 'rust',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'jinx-rust',
  ignoreFocusFields: ['loc'],
  parse(code, options) {
    return this.rs.parseFile(code, { ...options }).toJSON()
  },
  onValue(node) {
    if (node && typeof node.toJSON === 'function') {
      return node.toJSON()
    }
    return node
  },
  valueHint(key, value) {
    if (key === 'nodeType') {
      return `NodeType.${this.NodeType[value]}`
    }
    if (key === 'kind') {
      return `LiteralKind.${this.LiteralKind[value]}`
    }
  },
  getNodeLocation: genGetNodeLocation('jinxRust'),
}

export const rust: LanguageOption = {
  label: 'Rust',
  icon: 'i-vscode-icons:file-type-rust',
  parsers: [syn, jinxRust],
  codeTemplate: rustTemplate,
}
