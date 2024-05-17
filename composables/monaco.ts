import jsonToAst from 'json-to-ast'
import type { Parser } from '#imports'
import type * as monaco from 'monaco-editor'

export const editorCursor = ref<number>(0)

export type MonacoLanguage =
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'html'
  | 'vue'
  | 'svelte'
  | 'css'

export type Range = { start: number; end: number }
export type JsonNode =
  | jsonToAst.IdentifierNode
  | jsonToAst.PropertyNode
  | jsonToAst.ValueNode

export function collectPositionMap(ast: any, parser: Parser) {
  const { getAstLocation } = parser
  if (!getAstLocation) return

  const astAst = jsonToAst(ast, { loc: true })

  // AST range -> code range
  const positionMap: Map<Range, Range> = new Map()
  traverseNode(astAst, (node) => {
    const range = getAstLocation(node)
    if (!range) return
    positionMap.set(
      { start: node.loc!.start.offset, end: node.loc!.end.offset },
      range,
    )
  })
  return positionMap

  function traverseNode(node: JsonNode, cb: (node: JsonNode) => void): void {
    cb(node)

    switch (node.type) {
      case 'Array':
      case 'Object':
        node.children.forEach((n) => traverseNode(n, cb))
        break
      case 'Property':
        cb(node.key)
        traverseNode(node.value, cb)
        break
      case 'Identifier':
      case 'Literal':
    }
  }
}

export function getJsonValue(
  node: jsonToAst.ValueNode,
  path: Readonly<(string | number)[]>,
) {
  let current: JsonNode | undefined = node
  for (const sub of path) {
    if (!current) return
    switch (current.type) {
      case 'Object':
        current = current.children.find((n) => n.key.value === sub)?.value
        break
      case 'Array':
        current = current.children[sub as number]
        break
      default:
        return
    }
  }
  if (current?.type === 'Literal') return current.value
  return current
}

export function getSharedMonacoOptions(): monaco.editor.IStandaloneEditorConstructionOptions {
  return {
    automaticLayout: true,
    theme: isDark.value ? 'vs-dark' : 'vs',
    fontFamily:
      '"Cascadia Code", "Jetbrains Mono", "Fira Code", "Menlo", "Consolas", monospace',
    tabSize: 2,
    minimap: {
      enabled: false,
    },
  }
}
