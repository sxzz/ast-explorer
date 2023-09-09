import { type CompileOptions, type compile } from 'svelte/compiler'
import { type LanguageOption, type Parser } from '../language'

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
      (mod) => mod.default
    ),
  version: () =>
    fetch('https://esm.sh/svelte/package.json')
      .then((r) => r.json())
      .then((raw) => `@svelte/compiler@${raw.version}`),
  parse(code, options) {
    return this(code, options)?.ast
  },
}

export const svelte: LanguageOption = {
  label: 'Svelte',
  icon: 'i-vscode-icons:file-type-svelte',
  parsers: [svelteCompiler],
}
