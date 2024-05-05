import type { LanguageOption, Parser } from '../language'
import type parse from 'json-to-ast'

// @unocss-include

const jsonToAst: Parser<typeof parse, parse.Options> = {
  id: 'json-to-ast',
  label: 'json-to-ast',
  icon: 'i-vscode-icons:file-type-json',
  link: 'https://github.com/vtrushin/json-to-ast',
  editorLanguage: 'json',
  options: {
    configurable: true,
    defaultValue: {
      loc: false,
    },
    editorLanguage: 'json',
  },
  pkgName: 'json-to-ast',
  version: fetchVersion,
  async init(pkg) {
    const mod = await import(`https://cdn.jsdelivr.net/npm/${pkg}/+esm`)
    return mod.default
  },
  parse(code, options) {
    return this(code, { ...options })
  },
  getAstLocation(node: JsonNode) {
    if (node.type !== 'Object') return
    if (!getJsonValue(node, ['type'])) return

    const start = getJsonValue(node, ['loc', 'start', 'offset'])
    const end = getJsonValue(node, ['loc', 'end', 'offset'])
    if (typeof start !== 'number' || typeof end !== 'number') return

    return { start, end }
  },
}

export const json: LanguageOption = {
  label: 'JSON',
  icon: 'i-vscode-icons:file-type-json',
  parsers: [jsonToAst],
}
