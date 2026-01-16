import type { Parser } from './index'
import type * as TreeSitter from 'web-tree-sitter'

const shared = {
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  icon: 'https://cdn.jsdelivr.net/gh/tree-sitter/tree-sitter/docs/src/assets/images/tree-sitter-small.png',
  init: (moduleUrl: string) => initTreeSitterParser(moduleUrl),
  parse(this: TreeSitter.Parser, code: string) {
    const parsed = this.parse(code)
    return parsed && convertNode(parsed.rootNode)
  },
  getNodeLocation: genGetNodeLocation('treeSitter'),
} as const

export interface TreeSitterOptions {
  wasmUrl: string
}

export const treeSitter: Parser<void, TreeSitterOptions> = {
  id: 'tree-sitter',
  label: 'Tree Sitter',
  icon: shared.icon,
  editorLanguage: 'text',
  options: {
    configurable: true,
    defaultValue: {
      wasmUrl: getJsdelivrUrl(
        'tree-sitter-javascript',
        '/tree-sitter-javascript.wasm',
      ),
    },
    editorLanguage: 'json',
  },
  pkgName: '',
  init: () => {},
  async parse(code, options) {
    if (!options.wasmUrl) {
      throw new Error('WASM URL is required in options')
    }

    const parser = await initTreeSitterParser(options.wasmUrl)
    const parsed = parser.parse(code)
    return parsed && convertNode(parsed.rootNode)
  },
  getNodeLocation: shared.getNodeLocation,
  gui: () => import('./TreeSitterGui.vue'),
}

export const treeSitterJavascript: Parser<TreeSitter.Parser> = {
  ...shared,
  id: 'tree-sitter-javascript',
  label: 'tree-sitter-javascript',
  link: 'https://github.com/tree-sitter/tree-sitter-javascript',
  editorLanguage: 'javascript',
  pkgName: 'tree-sitter-javascript',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter-javascript.wasm'),
}

export const treeSitterTypescript: Parser<TreeSitter.Parser> = {
  ...shared,
  id: 'tree-sitter-typescript',
  label: 'tree-sitter-typescript',
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
  ...shared,
  id: 'tree-sitter-c-sharp',
  label: 'tree-sitter',
  link: 'https://github.com/tree-sitter/tree-sitter-c-sharp',
  editorLanguage: 'csharp',
  pkgName: 'tree-sitter-c-sharp',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter-c_sharp.wasm'),
}

export const treeSitterPython: Parser<TreeSitter.Parser> = {
  ...shared,
  id: 'tree-sitter-python',
  label: 'tree-sitter-python',
  link: 'https://github.com/tree-sitter/tree-sitter-python',
  editorLanguage: 'python',
  pkgName: 'tree-sitter-python',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter-python.wasm'),
}

export const treeSitterRust: Parser<TreeSitter.Parser> = {
  ...shared,
  id: 'tree-sitter-rust',
  label: 'tree-sitter-rust',
  link: 'https://github.com/tree-sitter/tree-sitter-rust',
  editorLanguage: 'rust',
  pkgName: 'tree-sitter-rust',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter-rust.wasm'),
}

function convertNode(node: TreeSitter.Node): any {
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
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load WASM: ${res.status} ${res.statusText}`)
      }
      return res.arrayBuffer()
    }),
  ])
  const language = await Language.load(new Uint8Array(response))

  const parser = new Parser()
  parser.setLanguage(language)

  return parser
}
