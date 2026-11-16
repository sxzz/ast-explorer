import type { Parser } from '..'
import type * as Yuku from 'yuku'

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

export const yuku: Parser<typeof Yuku, Options> = {
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
  pkgName: 'yuku',
  parse(code, options) {
    const file = this.parse(code, options)

    return {
      program: file.program,
      diagnostics: file.diagnostics,
      sourceType: file.sourceType,
      ...(!options.attachComments && { comments: file.comments }),
      ...(options.tokens && {
        tokens: tokensToArray(file.tokens, this.TokenKind),
      }),
    }
  },
  editorLanguage: (options) => detectMonacoLanguage(options?.lang),
  getNodeLocation: genGetNodeLocation('startEnd'),
  gui: () => import('./YukuGui.vue'),
}
