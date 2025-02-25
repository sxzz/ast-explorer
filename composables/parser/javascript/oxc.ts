import type { Parser } from '..'
import type * as Oxc from '@oxc-parser/wasm/web/oxc_parser_wasm'

export const oxc: Parser<typeof Oxc, Partial<Oxc.ParserOptions>> = {
  id: 'oxc',
  label: 'Oxc',
  icon: 'https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/logo-square-min.png',
  link: 'https://oxc.rs/docs/guide/usage/parser.html',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      sourceFilename: 'foo.ts',
    },
    editorLanguage: 'json',
  },
  pkgName: '@oxc-parser/wasm',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, `/web/oxc_parser_wasm.js`),
  init: (url) =>
    importUrl(url).then(async (mod: typeof Oxc) => {
      await mod.default()
      return mod
    }),
  parse(code, options) {
    const { program, comments, errors } = this.parseSync(code, { ...options })
    return { program, comments, errors }
  },
  editorLanguage(options) {
    return options.sourceFilename?.endsWith('.ts') ? 'typescript' : 'javascript'
  },
  getNodeLocation,
  gui: () => import('./OxcGui.vue'),
}
