import type { Parser } from '../index'
import type Typescript from 'typescript'

// @unocss-include

export const typescript: Parser<typeof Typescript, Record<string, never>> = {
  id: 'typescript-json',
  label: 'typescript',
  icon: 'i-vscode-icons:file-type-typescript-official',
  link: 'https://www.typescriptlang.org/',
  editorLanguage: 'json',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'typescript',
  init: (url) => resolveDefault(importUrl(url)),
  async version() {
    return (await this).version
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
  nodeTitle(value) {
    const kind: Typescript.SyntaxKind | undefined = value?.kind
    if (kind == null) return
    return getSyntaxKind(this, kind)
  },
  valueHint(key, value) {
    if (typeof value !== 'number') return

    switch (key) {
      case 'kind':
        return `SyntaxKind.${getSyntaxKind(this, value)}`
      case 'flags':
        return getNodeFlags(this, value)
    }
  },
  hideKeys: ['parent'],
}

const cache = new WeakMap<
  typeof Typescript,
  Record<Typescript.SyntaxKind, string>
>()

function getSyntaxKind(ts: typeof Typescript, kind: Typescript.SyntaxKind) {
  const cached = cache.get(ts)
  if (cached) return cached[kind]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const syntaxKinds = {} as Record<Typescript.SyntaxKind, string>
  for (const [key, value] of Object.entries(ts.SyntaxKind)) {
    if (typeof value === 'number' && !syntaxKinds[value]) {
      syntaxKinds[value] = key
    }
  }
  cache.set(ts, syntaxKinds)
  return syntaxKinds[kind]
}

function getNodeFlags(ts: typeof Typescript, flags: Typescript.NodeFlags) {
  const flagNames = Object.keys(ts.NodeFlags).filter(
    (key) => flags & (ts.NodeFlags as any)[key],
  )
  return flagNames.map((name) => `NodeFlags.${name}`).join(' | ')
}
