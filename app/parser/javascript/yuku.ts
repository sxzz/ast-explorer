import type { Parser } from '..'
import type * as Yuku from '@yuku-parser/wasm'

export type Options = Yuku.ParseOptions

export const yuku: Parser<typeof Yuku, Options> = {
  id: 'yuku-parser',
  label: 'Yuku',
  icon: 'https://raw.githubusercontent.com/yuku-toolchain/yuku/refs/heads/main/docs/public/favicon.svg',
  link: 'https://yuku.fyi',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      lang: 'js',
      preserveParens: true,
      allowReturnOutsideFunction: false,
      semanticErrors: false,
      attachComments: false,
    },
    editorLanguage: 'json',
  },
  pkgName: '@yuku-parser/wasm',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/index.js'),
  parse(code, options) {
    const { program, comments, diagnostics } = this.parse(code, options)
    return { program, comments, diagnostics }
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
