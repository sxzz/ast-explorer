import { typescript as base } from '../javascript/typescript'
import type { Parser } from '../index'
import type Typescript from 'typescript'

// @unocss-include

export const typescript: Parser<typeof Typescript, Record<string, never>> = {
  ...base,
  id: 'typescript-json',
  editorLanguage: 'json',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  parse(code) {
    return this.parseJsonText('file.json', code)
  },
  getNodeLocation(node) {
    if (!node || typeof node !== 'object') return
    if (node.pos !== undefined && node.end !== undefined) {
      return [node.pos, node.end]
    }
  },
  gui: undefined,
}
