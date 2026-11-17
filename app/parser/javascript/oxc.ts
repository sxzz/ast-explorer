import { getNodeLocation } from '~/composables/location'
import { getJsdelivrUrl } from '~/parser/utils'
import { detectMonacoLanguage } from '../utils.ts'
import type { Parser } from '..'
import type * as Oxc from 'oxc-parser'

export type ParserOptions = Oxc.ParserOptions & { filename: string }

export const oxc: Parser<typeof Oxc, Partial<ParserOptions>> = {
  id: 'oxc',
  label: 'Oxc',
  icon: 'https://cdn.jsdelivr.net/gh/oxc-project/oxc-assets/bracketless.svg',
  link: 'https://oxc.rs/docs/guide/usage/parser.html',
  options: {
    configurable: true,
    defaultValue: {
      filename: 'foo.ts',

      sourceType: 'module',
      preserveParens: true,
      range: false,
      showSemanticErrors: false,
    },
    editorLanguage: 'json',
  },
  pkgName: '@oxc-parser/binding-wasm32-wasip1',
  getModuleUrl: (pkgId) => getJsdelivrUrl(pkgId, '/browser-bundle.js'),
  parse(code, options) {
    const { program, comments, errors } = this.parseSync(
      options.filename ?? 'test.js',
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
  editorLanguage: (options) => detectMonacoLanguage(options.filename),
  getNodeLocation,
  gui: () => import('./OxcGui.vue'),
}
