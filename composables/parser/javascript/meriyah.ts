import type { Parser } from '..'
import type * as Meriyah from 'meriyah'

export type Options = Omit<Meriyah.Options, 'onComment'> & {
  comment?: boolean
}

type ProgramWithComments = Meriyah.ESTree.Program & {
  comments?: Meriyah.ESTree.Comment[]
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
    },
    editorLanguage: 'json',
  },
  pkgName: 'meriyah',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/dist/meriyah.mjs`),
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
}
