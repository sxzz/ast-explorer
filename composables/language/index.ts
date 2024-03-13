import { javascript } from './javascript'
import { vue } from './vue'
import { svelte } from './svelte'
import { json } from './json'
import { html } from './html'
import type { JsonNode, Range } from '#imports'

export interface Parser<C = unknown, O = unknown> {
  id: string
  label: string
  icon: string
  init?: () => C | Promise<C>
  version: string | ((this: C | Promise<C>) => string | Promise<string>)
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
  json,
  html,
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

export const parserVersion = ref('')

const astLocationFields = {
  babel: {
    type: ['type'],
    start: ['start'],
    end: ['end'],
  },
  ts: {
    type: ['kind'],
    start: ['pos'],
    end: ['end'],
  },
  swc: {
    type: ['type'],
    start: ['span', 'start'],
    end: ['span', 'end'],
  },
  ranges: {
    type: ['type'],
    start: ['range', 0],
    end: ['range', 1],
  },
} as const

export function getAstLocation(
  preset: keyof typeof astLocationFields,
  node: JsonNode,
) {
  if (node.type !== 'Object') return
  if (!getJsonValue(node, astLocationFields[preset].type)) return

  const start = getJsonValue(node, astLocationFields[preset].start)
  const end = getJsonValue(node, astLocationFields[preset].end)
  if (typeof start !== 'number' || typeof end !== 'number') return

  return { start, end }
}
