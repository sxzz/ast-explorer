import { javascript } from './javascript'
import { vue } from './vue'
import { svelte } from './svelte'
import { json } from './json'
import { html } from './html'
import { css } from './css'
import type { JsonNode, Range } from '#imports'

export interface Parser<C = unknown, O = unknown> {
  id: string
  label: string
  icon: string
  link: string
  pkgName: string
  version:
    | string
    | ((this: C | Promise<C>, pkgName: string) => string | Promise<string>)
  overrideVersion?: boolean
  init?: (pkgId: string) => C | Promise<C>
  parse: (this: C, code: string, options: O) => unknown
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
  getAstLocation?: (ast: JsonNode) => Range | undefined
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
  css,
  html,
  json,
}
export type Language = keyof typeof LANGUAGES

export const currentLanguage = computed(
  () => LANGUAGES[currentLanguageId.value] || LANGUAGES.javascript,
)

export const currentParser = computed(
  () =>
    (currentLanguage.value &&
      currentParserId.value &&
      currentLanguage.value.parsers.find(
        (p) => p.id === currentParserId.value,
      )) ||
    Object.values(currentLanguage.value.parsers)[0],
)

export const overrideVersion = ref<string>()
export const displayVersion = ref<string>()
