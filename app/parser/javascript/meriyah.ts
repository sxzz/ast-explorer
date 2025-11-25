import type { Parser } from '..'
import type * as Meriyah from 'meriyah'

export type Options = Omit<Meriyah.Options, 'onComment' | 'onToken'> & {
  comment?: boolean
  token?: boolean
}

type ProgramWithCommentsAndTokens = Meriyah.ESTree.Program & {
  comments?: Meriyah.ESTree.Comment[]
  tokens?: Meriyah.ESTree.Comment[]
}

export const meriyah: Parser<typeof Meriyah, Options> = {
  id: 'meriyah',
  label: 'meriyah',
  icon: 'https://avatars.githubusercontent.com/u/49381517',
  link: 'https://github.com/meriyah/meriyah',
  options: {
    configurable: true,
    defaultValue: {
      module: true,
      ranges: true,
      raw: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'meriyah',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/dist/meriyah.min.mjs`),
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
  gui: () => import('./MeriyahGui.vue'),
}
