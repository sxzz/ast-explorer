import type { Parser } from '..'
import type * as Acorn from 'acorn'
import type * as AcornLoose from 'acorn-loose'

export type Options = Omit<Acorn.Options, 'onComment' | 'onToken'> & {
  comment?: boolean
  token?: boolean
}

type ProgramWithCommentsAndTokens = Acorn.Program & {
  comments?: Acorn.Comment[]
  tokens?: Acorn.Token[]
}

export const acorn: Parser<typeof Acorn, Options> = {
  id: 'acorn',
  label: 'acorn',
  icon: 'https://cdn.jsdelivr.net/gh/acornjs/acorn@master/logo.svg',
  link: 'https://github.com/acornjs/acorn',
  options: {
    configurable: true,
    defaultValue: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    editorLanguage: 'json',
  },
  pkgName: 'acorn',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/dist/acorn.mjs`),
  async version() {
    return (await this).version
  },
  parse(code, options) {
    const comments = options.comment ? [] : undefined
    const tokens = options.token ? [] : undefined
    const ast = this.parse(code, {
      ...options,
      onComment: comments,
      onToken: tokens,
    }) as ProgramWithCommentsAndTokens
    if (options.comment) {
      ast.comments = comments
    }
    if (options.token) {
      ast.tokens = tokens
    }

    return ast
  },
  editorLanguage: 'javascript',
  getNodeLocation,
  gui: () => import('./AcornGui.vue'),
}

export const acornLoose: Parser<typeof AcornLoose, Options> = {
  ...(acorn as any),
  id: 'acorn-loose',
  label: 'acorn-loose',
  pkgName: 'acorn-loose',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/+esm`),
  version: undefined,
}
