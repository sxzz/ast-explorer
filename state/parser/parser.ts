import { getIntersection } from '~/utils'
import { editorLayout } from '../ui'

// language
export const currentLanguageId = ref<Language>('javascript')
export const currentLanguage = computed(
  () => LANGUAGES[currentLanguageId.value] || LANGUAGES.javascript,
)
const findParser = (
  parserId: string | undefined,
  parsers: Parser[],
): Parser => {
  const parser = parsers.find((parser) => parser.id === parserId)
  if (parser) return parser

  return Object.values(parsers)[0]!
}

// parser
export const currentParserIds = ref<string[]>([])
export const currentParsers = computed(() => {
  const { parsers } = currentLanguage.value
  return [
    findParser(currentParserIds.value[0], parsers),
    findParser(currentParserIds.value[1], parsers),
  ]
})

export const currentParsersGuis = computed(() =>
  currentParsers.value.map(
    (parser) => parser.gui && defineAsyncComponent(parser.gui),
  ),
)

export function setParserId(id: string, idx?: number) {
  overrideVersions.value = []
  if (idx !== undefined) {
    currentParserIds.value[idx] = id
  } else {
    currentParsers.value.forEach((_, idx) => (currentParserIds.value[idx] = id))
  }
}

// parser version
export const overrideVersions = ref<Array<string | undefined>>([])
export const displayVersions = ref<Array<string | undefined>>([])
export const isUrlVersions = computed(() =>
  overrideVersions.value.map((overrideVersion) => isUrl(overrideVersion || '')),
)

export function initParserState() {
  // set code template when language changes
  watch(currentLanguage, (language) => {
    code.value = language.codeTemplate
  })

  // bug: The pop-up will be incorrect when switching, think about the correct execution logic
  // This will result in two internal parsers when there is only one, resulting in redundant execution
  // How to clear data when switching
  watch(editorLayout, () => {
    switch (editorLayout.value) {
      case 'left-right':
        currentParserIds.value.pop()
    }
  })

  // ensure currentParsersId is valid
  watch(
    [currentLanguage, currentParserIds],
    () => {
      const currentLanguageParserIds = currentLanguage.value.parsers.map(
        (p) => p.id,
      )
      if (
        !currentParserIds.value.length ||
        getIntersection(currentParserIds.value, currentLanguageParserIds)
          .length === 0
      ) {
        setParserId(currentLanguageParserIds[0]!)
      }
    },
    { immediate: true, flush: 'sync' },
  )
}
