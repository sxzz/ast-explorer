import { csharpTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as TreeSitter from 'web-tree-sitter'

interface TreeSitterContext {
  parser: TreeSitter.Parser
}

function convertNode(node: TreeSitter.Node): any {
  const {
    startIndex,
    endIndex,
    startPosition,
    endPosition,
    type,
    children,
    text,
  } = node
  return {
    startIndex,
    endIndex,
    startPosition,
    endPosition,
    type,
    text,
    children: children.map(convertNode),
  }
}

// @unocss-include
const treeSitterCSharp: Parser<TreeSitterContext> = {
  id: 'tree-sitter-c-sharp',
  label: 'tree-sitter',
  icon: 'i-vscode-icons:file-type-csharp',
  link: 'https://github.com/tree-sitter/tree-sitter-c-sharp',
  editorLanguage: 'csharp',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'web-tree-sitter',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/tree-sitter.js'),
  async init(moduleUrl) {
    const { Parser, Language } = await importUrl<typeof TreeSitter>(moduleUrl)

    await Parser.init({
      locateFile: (scriptName: string) => {
        return getJsdelivrUrl('web-tree-sitter', `/${scriptName}`)
      },
    })

    const response = await fetch(
      getJsdelivrUrl('tree-sitter-c-sharp', '/tree-sitter-c_sharp.wasm'),
    )

    const languageWasmBytes = new Uint8Array(await response.arrayBuffer())
    const CSharpLanguage = await Language.load(languageWasmBytes)

    const parser = new Parser()
    parser.setLanguage(CSharpLanguage)

    return {
      parser,
    }
  },
  parse(code) {
    const parsed = this.parser.parse(code)
    return parsed ? convertNode(parsed.rootNode) : parsed
  },
  getNodeLocation: genGetNodeLocation('treeSitter'),
  nodeTitle: 'type',
}

export const csharp: LanguageOption = {
  label: 'C#',
  icon: 'i-vscode-icons:file-type-csharp',
  parsers: [treeSitterCSharp],
  codeTemplate: csharpTemplate,
}
