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

export function getAstLocation(
  preset: keyof typeof astLocationFields,
  node: JsonNode,
) {
  if (node.type !== 'Object') return
  if (!getJsonValue(node, astLocationFields[preset].type)) return

  const start = getJsonValue(node, astLocationFields[preset].start)
  const end = getJsonValue(node, astLocationFields[preset].end)
  if (typeof start !== 'number' || typeof end !== 'number') return

  return { start, end }
}

export function fetchVersion(
  pkg: string,
  url = `https://cdn.jsdelivr.net/npm/${pkg}/package.json`,
) {
  return () =>
    fetch(url)
      .then((res) => res.json())
      .then((raw) => `${pkg}@${raw.version}`)
}
