import type { Parser } from '..'
import type * as Oxc from 'oxc-parser'

export type ParserOptions = Oxc.ParserOptions & { sourceFilename: string }

export const oxc: Parser<typeof Oxc, Partial<ParserOptions>> = {
  id: 'oxc',
  label: 'Oxc',
  icon: 'https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/round.svg',
  link: 'https://oxc.rs/docs/guide/usage/parser.html',
  options: {
    configurable: true,
    defaultValue: {
      sourceType: 'module',
      sourceFilename: 'foo.ts',
      preserveParens: true,
      range: false,
      showSemanticErrors: false,
    },
    editorLanguage: 'json',
  },
  pkgName: '@oxc-parser/binding-wasm32-wasi',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/browser-bundle.js'),
  parse(code, options) {
    const { program, comments, errors } = this.parseSync(
      options.sourceFilename ?? 'test.js',
      code,
      {
        sourceType: options.sourceType,
        preserveParens: options.preserveParens,
        range: options.range,
        showSemanticErrors: options.showSemanticErrors,
      },
    )
    return { program, comments, errors }
  },
  editorLanguage(options) {
    return options.sourceFilename?.endsWith('.ts') ? 'typescript' : 'javascript'
  },
  getNodeLocation,
  gui: () => import('./OxcGui.vue'),
}
