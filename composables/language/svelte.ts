import type { LanguageOption, Parser } from '../language'
import type { CompileOptions, compile } from 'svelte/compiler'

// @unocss-include

const svelteCompiler: Parser<typeof compile, CompileOptions> = {
  id: 'svelte-compiler',
  label: 'svelte/compiler',
  icon: 'i-vscode-icons:file-type-svelte',
  editorLanguage: 'svelte',
  options: {
    configurable: true,
    defaultValue: {
      generate: 'dom',
      hydratable: true,
    },
    editorLanguage: 'json',
  },
  init: () =>
    // @ts-expect-error
    import('https://esm.sh/svelte/src/compiler/compile/index.js').then(
      (mod) => mod.default,
    ),
  version: fetchVersion(
    '@svelte/compiler',
    'https://esm.sh/svelte/package.json',
  ),
  parse(code, options) {
    return this(code, options)?.ast
  },
  getAstLocation: getAstLocation.bind(null, 'babel'),
}

export const svelte: LanguageOption = {
  label: 'Svelte',
  icon: 'i-vscode-icons:file-type-svelte',
  parsers: [svelteCompiler],
}
