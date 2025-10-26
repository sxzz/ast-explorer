import type { Parser } from '..'
import type Typescript from 'typescript'

export const arkts: Parser<
  typeof Typescript,
  Typescript.CreateSourceFileOptions & { scriptKind: Typescript.ScriptKind }
> = {
  id: 'arkts',
  label: 'arkts',
  // @unocss-include
  icon: 'https://cdn.jsdelivr.net/gh/groupguanfang/ohos-typescript-browserify/logo.png',
  link: 'https://gitcode.com/openharmony/third_party_typescript/',
  options: {
    configurable: true,
    defaultValue: {
      languageVersion: 99,
      scriptKind: 8 as any,
    },
    editorLanguage: 'json',
  },
  pkgName: 'ohos-typescript-browserify',
  init: (url) => resolveDefault(importUrl(url)),
  async version() {
    return (await this).version
  },
  parse(code, { scriptKind, ...options }) {
    return this.createSourceFile('foo.ts', code, options, true, scriptKind)
  },
  editorLanguage: 'typescript',
  getNodeLocation(node) {
    if (!node || typeof node !== 'object') return
    if (
      typeof node.getStart === 'function' &&
      typeof node.getEnd === 'function'
    ) {
      return [node.getStart(), node.getEnd()]
    } else if (node.pos !== undefined && node.end !== undefined) {
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
      case 'phaseModifier':
        return `SyntaxKind.${getSyntaxKind(this, value)}`
      case 'flags':
        return getNodeFlags(this, value)
      case 'scriptKind':
        return `ScriptKind.${this.ScriptKind[value]}`
    }
  },
  hideKeys: ['parent'],
  gui: () => import('./TypescriptGui.vue'),
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
