import { svelteTemplate } from './template'
import type { LanguageOption, Parser } from './index'
import type * as Svelte from 'svelte/compiler'

// @unocss-include

const svelteCompiler: Parser<typeof Svelte, Svelte.CompileOptions> = {
  id: 'svelte-compiler',
  label: 'svelte/compiler',
  icon: 'i-vscode-icons:file-type-svelte',
  link: 'https://svelte.dev/docs/svelte-compiler#parse',
  editorLanguage: 'html',
  options: {
    configurable: true,
    defaultValue: {},
    editorLanguage: 'json',
  },
  pkgName: 'svelte',
  getModuleUrl: (pkg) => `https://esm.sh/${pkg}/src/compiler/index.js`,
  parse(code, options) {
    return this.compile(code, options)?.ast
  },
  getAstLocation,
}

export const svelte: LanguageOption = {
  label: 'Svelte',
  icon: 'i-vscode-icons:file-type-svelte',
  parsers: [svelteCompiler],
  codeTemplate: svelteTemplate,
}
