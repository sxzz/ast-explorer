import json5 from 'json5'
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

export const initted: Record<string, boolean> = Object.create(null)
async function initParser() {
  const { id, init } = currentParser.value
  if (initted[id]) return
  initted[id] = true
  await init?.()
}

watch(
  [currentParser, code, rawOptions],
  async () => {
    try {
      await initParser()
      ast.value = await currentParser.value.parse(
        code.value,
        json5.parse(rawOptions.value)
      )
      error.value = null
      // eslint-disable-next-line unicorn/catch-error-name
    } catch (err) {
      error.value = err
    }
  },
  { immediate: true }
)
