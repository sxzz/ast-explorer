import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { LANGUAGES, type Language } from '~/parser'
import { code } from '~/state/editor'

export const currentLanguageId = ref<Language>('javascript')
export const currentLanguage = computed(
  () => LANGUAGES[currentLanguageId.value] || LANGUAGES.javascript,
)

export const currentParserId = ref<string | undefined>()
export const currentParser = computed(() => {
  const { parsers } = currentLanguage.value
  if (currentParserId.value) {
    const parser = parsers.find((parser) => parser.id === currentParserId.value)
    if (parser) return parser
  }
  return Object.values(parsers)[0]!
})

export const currentParserGui = computed(
  () =>
    currentParser.value.gui && defineAsyncComponent(currentParser.value.gui),
)

export function setParserId(id: string) {
  overrideVersion.value = undefined
  currentParserId.value = id
}

export const overrideVersion = ref<string>()

export function initParserState() {
  watch(currentLanguage, (language) => {
    code.value = language.codeTemplate
  })

  watch(
    [currentLanguage, currentParserId],
    () => {
      if (
        !currentParserId.value ||
        currentLanguage.value.parsers.every(
          (p) => p.id !== currentParserId.value,
        )
      ) {
        setParserId(currentLanguage.value.parsers[0]!.id)
      }
    },
    { immediate: true, flush: 'sync' },
  )
}
