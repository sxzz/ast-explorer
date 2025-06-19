import { astroTemplate } from './template'
import type { LanguageOption, Parser } from './index'
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
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}/es2022/compiler.mjs`,
  async parse(code, options) {
    const wasmURL = getJsdelivrUrl('@astrojs/compiler', '/dist/astro.wasm')
    await this.initialize({ wasmURL })
    return (await this.parse(code, options)).ast
  },
  getNodeLocation: genGetNodeLocation('positionOffset'),
}

export const astro: LanguageOption = {
  label: 'Astro',
  icon: 'i-vscode-icons:file-type-light-astro',
  parsers: [astroCompiler],
  codeTemplate: astroTemplate,
}
