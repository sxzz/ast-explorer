import { astroTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Binding from '@astrojs/compiler-binding'
import type * as Astro from '@astrojs/compiler/types'

// @unocss-include

const astroCompiler: Parser<typeof Astro, Astro.ParseOptions> = {
  id: 'astro-compiler',
  label: '@astrojs/compiler',
  icon: 'i-vscode-icons:file-type-light-astro',
  link: 'https://github.com/withastro/compiler',
  editorLanguage: 'astro',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: '@astrojs/compiler',
  async init(moduleUrl) {
    const mod = await importUrl<typeof Astro>(moduleUrl)
    const wasmURL = getJsdelivrUrl('@astrojs/compiler', '/dist/astro.wasm')
    await mod.initialize({ wasmURL })
    return mod
  },
  async parse(code, options) {
    return (await this.parse(code, options)).ast
  },
  getNodeLocation: genGetNodeLocation('positionOffset'),
}

const astroCompilerRs: Parser<typeof Binding> = {
  id: 'astro-compiler-rs',
  label: '@astrojs/compiler-rs',
  icon: 'i-vscode-icons:file-type-light-astro',
  link: 'https://github.com/withastro/compiler-rs',
  editorLanguage: 'astro',
  options: {
    configurable: false,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: '@astrojs/compiler-rs',
  getModuleUrl: (_pkg, version) =>
    `https://esm.sh/@astrojs/compiler-binding-wasm32-wasi${
      version ? `@${version}` : ''
    }/astro.wasi-browser.js`,
  parse(code) {
    const result = this.parseAstroSync(code)
    return { ast: JSON.parse(result.ast), diagnostics: result.diagnostics }
  },
  getNodeLocation: genGetNodeLocation('startEnd'),
}

export const astro: LanguageOption = {
  label: 'Astro',
  icon: 'i-vscode-icons:file-type-light-astro',
  parsers: [astroCompiler, astroCompilerRs],
  codeTemplate: astroTemplate,
}
