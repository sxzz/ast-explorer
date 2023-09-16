import { javascript } from './javascript'
import { vue } from './vue'
import { svelte } from './svelte'
import { json } from './json'

export type MonacoLanguage =
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'html'
  | 'vue'
  | 'svelte'
export interface Parser<C = unknown, O = unknown> {
  id: string
  label: string
  icon: string
  init?(): C | Promise<C>
  version: string | ((this: C | Promise<C>) => string | Promise<string>)
  parse(this: C, code: string, options: O): unknown
  options: {
    configurable: boolean
    editorLanguage: MonacoLanguage
  } & (
    | {
        defaultValue: string
        defaultValueType: 'javascript'
      }
    | {
        defaultValue: O
        defaultValueType?: 'json5'
      }
  )
  editorLanguage: MonacoLanguage | ((options: O) => MonacoLanguage)
}
export interface LanguageOption {
  label: string
  icon: string
  parsers: Parser<any, any>[]
}

export const LANGUAGES = {
  javascript,
  vue,
  svelte,
  json,
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

export const parserVersion = ref('')
