import type { Parser } from '../index.ts'
import type * as Swc from '@swc-next/core-browser'

export const swcNext: Parser<typeof Swc, Swc.ParserOptions> = {
  id: 'swc-next',
  label: 'SWC Next',
  // @unocss-include
  icon: 'i-vscode-icons:file-type-swc',
  link: 'https://swc.rs/docs/usage/core#parse',
  options: {
    configurable: true,
    defaultValue: {
      lang: 'ts',
    },
    editorLanguage: 'json',
  },
  pkgName: '@swc-next/core-browser',
  async init(url) {
    const mod = await importModule(url)
    await mod.default() // init
    return mod
  },
  parse(code, options) {
    const result = this.parseSync(code, { ...options })
    return result
  },
  editorLanguage(options) {
    return options?.lang === 'ts' ||
      options?.lang === 'tsx' ||
      options?.lang === 'dts'
      ? 'typescript'
      : 'javascript'
  },
  getNodeLocation,
  gui: () => import('./SwcNextGui.vue'),
}
