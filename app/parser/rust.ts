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
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/astexplorer_syn.min.js`),
  init: async (url) => {
    const mod = await importUrl(url)
    await mod.default()
    return mod
  },
  nodeTitle: '_type',
  parse(code, options) {
    return this.parseFile(code, { ...options })
  },

  getNodeLocation(node, ast) {
    if (ast ? node.type !== 'Object' : typeof node !== 'object') return

    const get = ast ? getJsonValue : getValue
    const type = get(node, ['_type'])
    if (!type) return

    const startLine = get(node, ['span', 'start', 'line'])
    const startColumn = get(node, ['span', 'start', 'column'])
    const endLine = get(node, ['span', 'end', 'line'])
    const endColumn = get(node, ['span', 'end', 'column'])
    if (
      typeof startLine !== 'number' ||
      typeof startColumn !== 'number' ||
      typeof endLine !== 'number' ||
      typeof endColumn !== 'number'
    )
      return

    const start = getOffset(code.value, startLine, startColumn)
    const end = getOffset(code.value, endLine, endColumn)
    return [start, end]
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
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/dist/index.min.js`),
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
