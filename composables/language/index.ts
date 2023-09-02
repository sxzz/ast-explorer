import json5 from 'json5'
import * as monaco from 'monaco-editor'
import { javascript } from './javascript'
import { vue } from './vue'

export type MonacoLanguage = 'javascript' | 'typescript' | 'json' | 'vue'
export interface LanguageOption {
  label: string
  icon: string
  language: MonacoLanguage | ((options: any) => MonacoLanguage)
  options: {
    configurable: boolean
    defaultValue: any
    language: MonacoLanguage
  }
  version: string
  parse(code: string, options: any): any
}

export const LANGUAGES = {
  javascript,
  vue,
}
export type Language = keyof typeof LANGUAGES

export const currentLanguage = computed(
  () => LANGUAGES[currentLanguageId.value] || LANGUAGES.javascript
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

watchEffect(async () => {
  try {
    ast.value = currentLanguage.value.parse(
      code.value,
      json5.parse(rawOptions.value)
    )
    error.value = null
  } catch (err) {
    error.value = err
  }
})
