const astLocationFields = {
  babel: {
    type: ['type'],
    start: ['start'],
    end: ['end'],
  },
  ts: {
    type: ['kind'],
    start: ['pos'],
    end: ['end'],
  },
  swc: {
    type: ['type'],
    start: ['span', 'start'],
    end: ['span', 'end'],
  },
  ranges: {
    type: ['type'],
    start: ['range', 0],
    end: ['range', 1],
  },
  cssTree: {
    type: ['type'],
    start: ['loc', 'start', 'offset'],
    end: ['loc', 'end', 'offset'],
  },
} as const

export function getAstLocation(preset: keyof typeof astLocationFields) {
  return (node: JsonNode) => {
    if (node.type !== 'Object') return
    if (!getJsonValue(node, astLocationFields[preset].type)) return

    const start = getJsonValue(node, astLocationFields[preset].start)
    const end = getJsonValue(node, astLocationFields[preset].end)
    if (typeof start !== 'number' || typeof end !== 'number') return

    return { start, end }
  }
}
export const getAstLocationBabel = getAstLocation('babel')

export async function fetchVersion(pkg: string) {
  const raw = await fetch(
    `https://cdn.jsdelivr.net/npm/${pkg}/package.json`,
  ).then((r) => r.json())
  return raw.version
}

export function importUrl(url: string) {
  return import(/* @vite-ignore */ url)
}
