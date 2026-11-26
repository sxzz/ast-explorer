import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { LANGUAGES, type Language, type LanguageOption } from '~/parser'
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

export const currentCodeTemplate = computed(
  () => currentParser.value.codeTemplate ?? currentLanguage.value.codeTemplate,
)

function isLanguageTemplate(language: LanguageOption, code: string) {
  return (
    code === language.codeTemplate ||
    language.parsers.some((parser) => parser.codeTemplate === code)
  )
}

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

  // Not immediate, so code restored from the URL is kept. Registered after the
  // parser id fallback above, so its initial `setParserId()` is already applied
  // when the old values are captured and doesn't count as a parser change.
  watch(
    [currentLanguage, currentCodeTemplate],
    ([language, template], [oldLanguage, oldTemplate]) => {
      // Switching parsers within a language only replaces code that is still
      // an untouched template, so user edits survive.
      if (
        language !== oldLanguage ||
        code.value === oldTemplate ||
        isLanguageTemplate(language, code.value)
      ) {
        code.value = template
      }
    },
  )
}
