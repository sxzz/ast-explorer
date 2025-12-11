import * as GoFast from '@joekav/go-fast'
import type { Parser } from '..'

export const gofast: Parser<typeof GoFast, GoFast.ParseOptions> = {
  id: 'go-fast',
  label: 'go-fAST',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-go',
  link: 'https://github.com/t14raptor/go-fast',
  editorLanguage: 'javascript',
  options: {
    configurable: true,
    defaultValue: {
      resolve: false,
    },
    editorLanguage: 'json',
  },
  pkgName: '@joekav/go-fast',
  getModuleUrl: (pkg) => getJsdelivrUrl(pkg, '/dist/go-fast.wasm'),
  async init(url) {
    // @ts-expect-error browser init() requires wasmURL option
    await GoFast.init({ wasmURL: url })
    return GoFast
  },
  parse(code, options) {
    // @ts-expect-error types incorrectly show parse as async
    const parsed = GoFast.parse(code, options) as GoFast.ParseResult
    if (GoFast.isParseError(parsed)) {
      throw new Error(parsed.error)
    }
    return parsed
  },
  getNodeLocation: genGetNodeLocation('startEnd'),
  gui: () => import('./GoFastGui.vue'),
}
