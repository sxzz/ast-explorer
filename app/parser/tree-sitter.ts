import type { Parser } from './index'
import type * as TreeSitter from 'web-tree-sitter'

const common = {
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  init: (moduleUrl: string) => initTreeSitterParser(moduleUrl),
  parse(this: TreeSitter.Parser, code: string) {
    const parsed = this.parse(code)
    return parsed && convertNode(parsed.rootNode)
  },
  getNodeLocation: genGetNodeLocation('treeSitter'),
} as const

export const treeSitterJavascript: Parser<TreeSitter.Parser> = {
  ...common,
  id: 'tree-sitter-javascript',
  label: 'tree-sitter-javascript',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-js',
  link: 'https://github.com/tree-sitter/tree-sitter-javascript',
  editorLanguage: 'javascript',
  pkgName: 'tree-sitter-javascript',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter-javascript.wasm'),
}

export const treeSitterTypescript: Parser<TreeSitter.Parser> = {
  ...common,
  id: 'tree-sitter-typescript',
  label: 'tree-sitter-typescript',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-typescript',
  link: 'https://github.com/tree-sitter/tree-sitter-typescript',
  editorLanguage: 'typescript',
  pkgName: 'tree-sitter-typescript',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter-typescript.wasm'),
}

export const treeSitterTsx: Parser<TreeSitter.Parser> = {
  ...treeSitterTypescript,
  id: 'tree-sitter-tsx',
  label: 'tree-sitter-tsx',
  // @unocss-include
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter-tsx.wasm'),
}

export const treeSitterCSharp: Parser<TreeSitter.Parser> = {
  id: 'tree-sitter-c-sharp',
  label: 'tree-sitter',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-csharp',
  link: 'https://github.com/tree-sitter/tree-sitter-c-sharp',
  editorLanguage: 'csharp',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'tree-sitter-c-sharp',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter-c_sharp.wasm'),
  init(moduleUrl) {
    return initTreeSitterParser(moduleUrl)
  },
  parse(code) {
    const parsed = this.parse(code)
    return parsed && convertNode(parsed.rootNode)
  },
  getNodeLocation: genGetNodeLocation('treeSitter'),
}

export function convertNode(node: TreeSitter.Node): any {
  const {
    startIndex,
    endIndex,
    startPosition,
    endPosition,
    type,
    typeId,
    children,
    text,
  } = node

  return {
    startIndex,
    endIndex,
    startPosition,
    endPosition,
    type,
    typeId,
    text,
    children: children.map(convertNode),
  }
}

const pkg = 'web-tree-sitter'
async function loadTreeSitter() {
  const treeSitter = await importUrl<typeof TreeSitter>(
    getJsdelivrUrl(pkg, '/tree-sitter.js'),
  )
  await treeSitter.Parser.init({
    locateFile: (scriptName: string) => getJsdelivrUrl(pkg, `/${scriptName}`),
  })
  return treeSitter
}

async function initTreeSitterParser(url: string) {
  const [{ Parser, Language }, response] = await Promise.all([
    loadTreeSitter(),
    fetch(url).then((res) => res.arrayBuffer()),
  ])
  const CSharpLanguage = await Language.load(new Uint8Array(response))

  const parser = new Parser()
  parser.setLanguage(CSharpLanguage)

  return parser
}
