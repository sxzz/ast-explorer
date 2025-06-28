import { getIntersection } from "~/utils"
import { expLayout } from "../ui"

// language
export const currentLanguageId = ref<Language>('javascript')
export const currentLanguage = computed(
  () => LANGUAGES[currentLanguageId.value] || LANGUAGES.javascript,
)
const findParser = (parserId: string | undefined, parsers: Parser[]): Parser => {
  const parser = parsers.find((parser) => parser.id === parserId)
  if (parser) return parser

  return Object.values(parsers)[0]!
}

// parser
export const currentParserIds = ref<string[]>([])
export const currentParsers = computed(() => {
  const { parsers } = currentLanguage.value
  return [findParser(currentParserIds.value[0], parsers), findParser(currentParserIds.value[1], parsers)]
})

export const currentParsersGuis = computed(
  () => currentParsers.value.map(parser => parser.gui && defineAsyncComponent(parser.gui))
)

export function setParserId(id: string ,idx?: number) {
  overrideVersion.value = undefined
  if(idx !== undefined) {
    currentParserIds.value[idx] = id
  }else {
    currentParsers.value.forEach((_,idx) => currentParserIds.value[idx] = id)
  }
}

// parser version
export const overrideVersion = ref<string>()
export const displayVersions = ref<string[]>([])
export const isUrlVersion = computed(() => isUrl(overrideVersion.value || ''))

export function initParserState() {
  console.log('2.initParserState')
  // set code template when language changes
  watch(currentLanguage, (language) => {
    code.value = language.codeTemplate
  })

  watch(expLayout, () => {
    switch (expLayout.value) {
      case 'layout2': 
        currentParserIds.value.pop()
    }
  })

  // ensure currentParsersId is valid
  watch(
    [currentLanguage, currentParserIds],
    () => {
      const currentLanguageParserIds = currentLanguage.value.parsers.map((p) => p.id)
      if (
        !currentParserIds.value.length ||
        getIntersection(currentParserIds.value, currentLanguageParserIds).length === 0
      ) {
        setParserId(currentLanguageParserIds[0]!)
      }
    },
    { immediate: true, flush: 'sync' },
  )
}

