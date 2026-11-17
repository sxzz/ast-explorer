import { shikiToMonaco } from '@shikijs/monaco'
import { grammars, loadedGrammars } from './highlighter'
import { registerPrettier } from './prettier'
import type * as Monaco from 'monaco-editor'
import type { HighlighterCore } from 'shiki/core'
import type { MonacoLanguage } from '~/parser'

// Languages Monaco doesn't know about; Shiki provides their tokenizers.
const extraLanguages: MonacoLanguage[] = [
  'vue',
  'svelte',
  'glimmer-js',
  'glimmer-ts',
  'astro',
  'solidity',
  'protobuf',
  'bash',
]

const plainGrammar = {
  tokenizeLine2: (_line: string, ruleStack: unknown) => ({
    tokens: new Uint32Array(2),
    ruleStack,
    stoppedEarly: false,
  }),
} as unknown as ReturnType<HighlighterCore['getLanguage']>

export function setupMonaco(
  monaco: typeof Monaco,
  highlighter: HighlighterCore,
): void {
  for (const id of extraLanguages) monaco.languages.register({ id })

  // `shikiToMonaco` only registers tokenizers for grammars that are already
  // loaded and can't add more later. Register all of them up front instead;
  // editors wait for `loadMonacoLanguage()` before using a language, and
  // anything else (e.g. code in hovers) stays plain until it's loaded.
  shikiToMonaco(
    {
      ...highlighter,
      getLoadedLanguages: () => Object.keys(grammars),
      getLanguage: (lang) =>
        loadedGrammars.has(lang as MonacoLanguage)
          ? highlighter.getLanguage(lang)
          : plainGrammar,
    },
    monaco,
  )

  monaco.json.jsonDefaults.setDiagnosticsOptions({
    allowComments: true,
    enableSchemaRequest: true,
    trailingCommas: 'ignore',
  })

  monaco.typescript.typescriptDefaults.setCompilerOptions({
    allowJs: true,
    target: monaco.typescript.ScriptTarget.ESNext,
    module: monaco.typescript.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.typescript.JsxEmit.React,
  })

  monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
    noSuggestionDiagnostics: true,
  })

  registerPrettier(monaco)
}
