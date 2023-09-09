import { type CompileOptions, type compile } from 'svelte/compiler'
import { type LanguageOption, type Parser } from '../language'

const Svelte: Parser<{ default: typeof compile }, CompileOptions> = {
  id: 'Svelte',
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
  // @ts-expect-error
  init: () => import('https://esm.sh/svelte/src/compiler/compile/index.js'),
  version: () =>
    fetch('https://esm.sh/svelte/package.json')
      .then((r) => r.json())
      .then((raw) => `@svelte/compiler@${raw.version}`),
  parse(code, options) {
    return this.default(code, options)?.ast
  },
}

export const svelte: LanguageOption = {
  label: 'Svelte',
  icon: 'i-vscode-icons:file-type-svelte',
  parsers: [Svelte],
}
