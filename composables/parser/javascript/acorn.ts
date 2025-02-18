import type { Parser } from '..'
import type * as Acorn from 'acorn'

export type Options = Omit<Acorn.Options, 'onComment'> & {
  comment?: boolean
}

type ProgramWithComments = Acorn.Program & {
  comments?: Acorn.Comment[]
}

export const acorn: Parser<typeof Acorn, Options> = {
  id: 'acorn',
  label: 'Acorn',
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
    const ast = this.parse(code, {
      ...options,
      onComment: comments,
    }) as ProgramWithComments
    if (options.comment) {
      ast.comments = comments
    }

    return ast
  },
  editorLanguage: 'javascript',
  getNodeLocation,
  gui: () => import('./AcornGui.vue'),
}
