import { shikiToMonaco } from '@shikijs/monaco'
import { grammars, loadedGrammars } from './highlighter'
import { registerPrettier } from './prettier'
import type * as Monaco from 'monaco-editor'
import type { HighlighterCore } from 'shiki/core'
import type { MonacoLanguage } from '~/parser'

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

  // `shikiToMonaco` can't add languages later, so register all of them now
  // and fall back to plain text until a grammar is loaded.
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
