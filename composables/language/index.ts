import * as monaco from 'monaco-editor'
import { javascript } from './javascript'
import { vue } from './vue'

export type MonacoLanguage = 'javascript' | 'typescript' | 'json' | 'vue'
export interface Parser {
  id: string
  label: string
  icon: string
  version: string
  init?(): void | Promise<void>
  parse(code: string, options: any): any
  options: {
    configurable: boolean
    defaultValue: any
    editorLanguage: MonacoLanguage
  }
  editorLanguage: MonacoLanguage | ((options: any) => MonacoLanguage)
}
export interface LanguageOption {
  label: string
  icon: string
  parsers: Record<string, Parser>
}

export const LANGUAGES = {
  javascript,
  vue,
}
export type Language = keyof typeof LANGUAGES

export const currentLanguage = computed(
  () => LANGUAGES[currentLanguageId.value] || LANGUAGES.javascript
)

export const currentParser = computed(
  () =>
    (currentLanguage.value &&
      currentParserId.value &&
      currentLanguage.value.parsers[currentParserId.value]) ||
    Object.values(currentLanguage.value.parsers)[0]
)

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  enableSchemaRequest: true,
  trailingCommas: 'ignore',
})

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  noEmit: true,
  esModuleInterop: true,
  jsx: monaco.languages.typescript.JsxEmit.Preserve,
  allowJs: true,
})
