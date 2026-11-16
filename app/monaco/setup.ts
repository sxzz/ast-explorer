import { shikiToMonaco } from '@shikijs/monaco'
import { registerPrettier } from './prettier'
import type * as Monaco from 'monaco-editor'
import type { HighlighterCore } from 'shiki/core'

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

export function setupMonaco(
  monaco: typeof Monaco,
  highlighter: HighlighterCore,
): void {
  for (const id of extraLanguages) monaco.languages.register({ id })
  shikiToMonaco(highlighter, monaco)

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
