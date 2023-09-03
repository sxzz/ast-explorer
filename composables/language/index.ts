import * as monaco from 'monaco-editor'
import { javascript } from './javascript'
import { vue } from './vue'

export type MonacoLanguage = 'javascript' | 'typescript' | 'json' | 'vue'
export interface Parser<C = any, O = any> {
  id: string
  label: string
  icon: string
  version: string
  init?(): C | Promise<C>
  parse(this: C, code: string, options: O): any
  options: {
    configurable: boolean
    defaultValue: O
    editorLanguage: MonacoLanguage
  }
  editorLanguage: MonacoLanguage | ((options: O) => MonacoLanguage)
}
export interface LanguageOption {
  label: string
  icon: string
  parsers: Parser[]
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
      currentLanguage.value.parsers.find(
        (p) => p.id === currentParserId.value
      )) ||
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
