import jsonToAst from 'json-to-ast'

export const editorCursor = ref<number>(0)

export type MonacoLanguage =
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'html'
  | 'vue'
  | 'svelte'

export type Range = { start: number; end: number }
export type JsonNode =
  | jsonToAst.IdentifierNode
  | jsonToAst.PropertyNode
  | jsonToAst.ValueNode

export function collectPositionMap(code: string, ast: any) {
  const astAst = jsonToAst(ast, { loc: true })

  // AST range -> code range
  const positionMap: Map<Range, Range> = new Map()
  traverseNode(astAst, (node) => {
    if (!node.loc || node.type !== 'Object') return
    if (!getValue(node, ['type'])) return
    const start = getValue(node, ['start'])
    const end = getValue(node, ['end'])
    if (typeof start !== 'number' || typeof end !== 'number') return

    positionMap.set(
      {
        start: node.loc!.start.offset,
        end: node.loc!.end.offset,
      },
      { start, end }
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

  function getValue(node: jsonToAst.ValueNode, path: (string | number)[]) {
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
}
