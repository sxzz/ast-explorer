import type { Parser } from '..'
import type * as Swc from '@swc/wasm-web'

function adjustSwcOffsetOfAst(obj: unknown, startOffset: number) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => adjustSwcOffsetOfAst(item, startOffset))
  } else if (isRecord(obj)) {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'span' && value && isSpan(value)) {
        const span = value
        span.start -= startOffset
        span.end -= startOffset
      } else {
        adjustSwcOffsetOfAst(obj[key], startOffset)
      }
    })
  }

  function isRecord(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && obj !== null
  }

  function isSpan(obj: unknown): obj is { start: number; end: number } {
    return (
      typeof obj === 'object' && obj !== null && 'start' in obj && 'end' in obj
    )
  }
}

export const swc: Parser<typeof Swc, Swc.ParseOptions> = {
  id: 'swc',
  label: 'SWC',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-swc',
  link: 'https://swc.rs/docs/usage/core#parse',
  options: {
    configurable: true,
    defaultValue: {
      syntax: 'ecmascript',
      jsx: false,
      decorators: false,
      importAssertions: false,
    },
    editorLanguage: 'json',
  },
  pkgName: '@swc/wasm-web',
  init: (pkg) =>
    importUrl(`https://cdn.jsdelivr.net/npm/${pkg}/wasm-web.js`).then(
      async (mod: typeof Swc) => {
        await mod.default()
        return mod
      },
    ),
  version: fetchVersion,
  async parse(code, options) {
    const result = await this.parse(code, { ...(options as any) })
    adjustSwcOffsetOfAst(result, result.span.start)
    return result
  },
  editorLanguage(options) {
    return options?.syntax === 'typescript' ? 'typescript' : 'javascript'
  },
  getAstLocation: getAstLocation('swc'),
}
