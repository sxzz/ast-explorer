import jsonToAst from 'json-to-ast'
import type { Parser } from '#imports'

const astLocationFields = {
  startEnd: {
    type: ['type'],
    start: ['start'],
    end: ['end'],
  },
  swc: {
    type: ['type'],
    start: ['span', 'start'],
    end: ['span', 'end'],
  },
  range: {
    type: ['type'],
    start: ['range', 0],
    end: ['range', 1],
  },
  locOffset: {
    type: ['type'],
    start: ['loc', 'start', 'offset'],
    end: ['loc', 'end', 'offset'],
  },
  typescript: {
    type: ['kind'],
    start: ['pos'],
    end: ['end'],
  },
  htmlparser2: {
    type: ['type'],
    start: ['startIndex'],
    end: ['endIndex'],
  },
  remark: {
    type: ['type'],
    start: ['position', 'start', 'offset'],
    end: ['position', 'end', 'offset'],
  },
} as const

export function genGetAstLocation(
  preset: keyof typeof astLocationFields,
): NonNullable<Parser['getAstLocation']> {
  return (node: any, ast?: boolean) => {
    if (ast ? node.type !== 'Object' : typeof node !== 'object') return

    const get = ast ? getJsonValue : getValue
    if (!get(node, astLocationFields[preset].type)) return

    const start = get(node, astLocationFields[preset].start)
    const end = get(node, astLocationFields[preset].end)
    if (typeof start !== 'number' || typeof end !== 'number') return

    return [start, end]
  }
}
export const getAstLocation = genGetAstLocation('startEnd')

export type Range = [start: number, end: number]
export type JsonNode =
  | jsonToAst.IdentifierNode
  | jsonToAst.PropertyNode
  | jsonToAst.ValueNode

export function getLocationMapping(ast: any, parser: Parser) {
  const { getAstLocation } = parser
  if (!getAstLocation) return

  const astAst = jsonToAst(ast, { loc: true })

  // AST range -> code range
  const locationMap: Map<Range, Range> = new Map()
  traverseNode(astAst, (node) => {
    const range = getAstLocation(node, true)
    if (!range) return
    locationMap.set([node.loc!.start.offset, node.loc!.end.offset], range)
  })
  return locationMap

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

function getValue(object: object, path: Readonly<(string | number)[]>) {
  let current: any = object
  for (const sub of path) {
    if (!current) return
    current = current[sub]
  }
  return current
}

function getJsonValue(
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

export function getRange(ast: any) {
  return currentParser.value.getAstLocation?.(ast)
}
