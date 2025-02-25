import type { Parser } from '../index'
import type * as Momoa from '@humanwhocodes/momoa'

// @unocss-include

export const momoa: Parser<typeof Momoa, Momoa.ParseOptions> = {
  id: 'momoa',
  label: 'momoa',
  icon: 'i-vscode-icons:file-type-json',
  link: 'https://github.com/humanwhocodes/momoa',
  editorLanguage: 'json',
  options: {
    configurable: true,
    defaultValue: {
      mode: 'json',
      ranges: false,
      tokens: false,
      allowTrailingCommas: false,
    },
    editorLanguage: 'json',
  },
  pkgName: '@humanwhocodes/momoa',
  init: (url) => importUrl(url),
  parse(code, options) {
    return this.parse(code, { ...options })
  },
  getNodeLocation,
  gui: () => import('./MomoaGui.vue'),
}
