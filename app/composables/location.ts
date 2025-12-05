import jsonToAst from 'json-to-ast'
import { currentParser } from '~/state/parser/parser'
import type { Parser } from '#imports'

const nodeLocationFields = {
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
  htmlparser2: {
    type: ['type'],
    start: ['startIndex'],
    end: ['endIndex'],
  },
  angularCompilerAst: {
    type: ['constructor', 'name'],
    start: ['sourceSpan', 'start'],
    end: ['sourceSpan', 'end'],
  },
  angularCompilerTmpl: {
    type: ['constructor', 'name'],
    start: ['sourceSpan', 'start', 'offset'],
    end: ['sourceSpan', 'end', 'offset'],
  },
  positionOffset: {
    type: ['type'],
    start: ['position', 'start', 'offset'],
    end: ['position', 'end', 'offset'],
  },
  postcss: {
    type: ['type'],
    start: ['source', 'start', 'offset'],
    end: ['source', 'end', 'offset'],
  },
  jinxRust: {
    type: ['type'],
    start: ['loc', '0'],
    end: ['loc', '1'],
  },
  php: {
    type: ['kind'],
    start: ['loc', 'start', 'offset'],
    end: ['loc', 'end', 'offset'],
  },
  ultrahtml: {
    type: ['type'],
    start: ['loc', '0', 'start'],
    end: ['loc', '1', 'end'],
  },
  graphql: {
    type: ['kind'],
    start: ['loc', 'start'],
    end: ['loc', 'end'],
  },
  angularHtmlParser: {
    type: ['kind'],
    start: ['sourceSpan', 'start', 'offset'],
    end: ['sourceSpan', 'end', 'offset'],
  },
} as const

export const locationKeyList = [
  'loc',
  'location',
  'start',
  'end',
  'span',
  'range',
  'position',
  'pos',
]

export function genGetNodeLocation(
  preset: keyof typeof nodeLocationFields,
): NonNullable<Parser['getNodeLocation']> {
  return (node: any, ast?: boolean) => {
    if (ast ? node.type !== 'Object' : typeof node !== 'object') return

    const get = ast ? getJsonValue : getValue
    const type = get(node, nodeLocationFields[preset].type)
    if (!type) return

    const start = get(node, nodeLocationFields[preset].start)
    const end = get(node, nodeLocationFields[preset].end)
    if (typeof start !== 'number' || typeof end !== 'number') return

    return [start, end]
  }
}
export const getNodeLocation = genGetNodeLocation('startEnd')

export type Range = [start: number, end: number]
export type JsonNode =
  | jsonToAst.IdentifierNode
  | jsonToAst.PropertyNode
  | jsonToAst.ValueNode

export function getLocationMapping(ast: any, parser: Parser) {
  const { getNodeLocation } = parser
  if (!getNodeLocation) return

  const astAst = jsonToAst(ast, { loc: true })

  // AST range -> code range
  const locationMap: Map<Range, Range> = new Map()
  traverseNode(astAst, (node) => {
    const range = getNodeLocation(node, true)
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
        if (node.key.value === 'tokens' /* TODO custom */) return
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
  return currentParser.value.getNodeLocation?.(ast)
}

export function isRegExp(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}
