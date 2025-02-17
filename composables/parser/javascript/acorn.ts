import type { Parser } from '..'
import type * as Acorn from 'acorn'

export type Options = Omit<Acorn.Options, 'onComment'> & {
  comments?: boolean
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
    const comments = options.comments ? [] : undefined
    const ast = this.parse(code, {
      ...options,
      onComment: comments,
    }) as ProgramWithComments
    if (options.comments) {
      ast.comments = comments
    }

    return ast
  },
  editorLanguage: 'javascript',
  getAstLocation,
  gui: () => import('./AcornGui.vue'),
}
