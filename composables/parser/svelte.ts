import type { LanguageOption, Parser } from './index'
import type { CompileOptions, compile } from 'svelte/compiler'

// @unocss-include

const svelteCompiler: Parser<typeof compile, CompileOptions> = {
  id: 'svelte-compiler',
  label: 'svelte/compiler',
  icon: 'i-vscode-icons:file-type-svelte',
  link: 'https://svelte.dev/docs/svelte-compiler#parse',
  editorLanguage: 'svelte',
  options: {
    configurable: true,
    defaultValue: {
      generate: 'dom',
      hydratable: true,
    },
    editorLanguage: 'json',
  },
  pkgName: 'svelte',
  init: (pkg) =>
    importUrl(`https://esm.sh/${pkg}/src/compiler/compile/index.js`).then(
      (mod) => mod.default,
    ),
  version: fetchVersion,
  parse(code, options) {
    return this(code, options)?.ast
  },
  getAstLocation: getAstLocationBabel,
}

export const svelte: LanguageOption = {
  label: 'Svelte',
  icon: 'i-vscode-icons:file-type-svelte',
  parsers: [svelteCompiler],
}
