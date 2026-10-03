import type { Parser } from '..'
import type * as YukuCore from '@yuku-core/wasm'
import type * as Yuku from 'yuku-parser'

export type Options = Omit<Yuku.ParseOptions, 'core'>

function tokensToArray(tokens: Yuku.TokenList, TokenKind: Yuku.TokenKindMap) {
  const names: Record<number, string> = {}
  for (const [name, kind] of Object.entries(TokenKind)) names[kind] = name
  return Array.from({ length: tokens.length }, (_, i) => ({
    type: names[tokens.kind(i)],
    value: tokens.text(i),
    start: tokens.start(i),
    end: tokens.end(i),
  }))
}

export const yuku: Parser<typeof Yuku & { core: Yuku.Core }, Options> = {
  id: 'yuku-parser',
  label: 'Yuku',
  icon: 'https://raw.githubusercontent.com/yuku-toolchain/yuku/refs/heads/main/docs/assets/favicon.svg',
  link: 'https://yuku.fyi',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      lang: 'js',
      preserveParens: true,
      semanticErrors: false,
      attachComments: false,
      tokens: false,
    },
    editorLanguage: 'json',
  },
  pkgName: 'yuku-parser',
  getModuleUrl: (pkgId) => getJsdelivrUrl(pkgId),
  async init(moduleUrl, pkgId) {
    const [mod, { load }] = await Promise.all([
      importModule<typeof Yuku>(moduleUrl),
      // load wasm same version as yuku-parser
      importJsdelivr<typeof YukuCore>(
        pkgId.replace('yuku-parser', '@yuku-core/wasm'),
      ),
    ])
    return { ...mod, core: await load() }
  },
  parse(code, options) {
    const { program, comments, tokens, diagnostics } = this.parse(code, {
      ...options,
      core: this.core,
    })
    return {
      program,
      ...(!options.attachComments && { comments }),
      ...(tokens && { tokens: tokensToArray(tokens, this.TokenKind) }),
      diagnostics,
    }
  },
  editorLanguage(options) {
    const lang = options?.lang
    return lang === 'ts' || lang === 'tsx' || lang === 'dts'
      ? 'typescript'
      : 'javascript'
  },
  getNodeLocation: genGetNodeLocation('startEnd'),
  gui: () => import('./YukuGui.vue'),
}
