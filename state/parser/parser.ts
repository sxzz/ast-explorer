// language
export const currentLanguageId = ref<Language>('javascript')
export const currentLanguage = computed(
  () => LANGUAGES[currentLanguageId.value] || LANGUAGES.javascript,
)

// parser
export const currentParserId = ref<string | undefined>()
export const currentParser = computed(() => {
  const { parsers } = currentLanguage.value
  if (currentParserId.value) {
    const parser = parsers.find((parser) => parser.id === currentParserId.value)
    if (parser) return parser
  }
  return Object.values(parsers)[0]
})

export const currentParserGui = computed(
  () =>
    currentParser.value.gui && defineAsyncComponent(currentParser.value.gui),
)

export function setParserId(id: string) {
  overrideVersion.value = undefined
  currentParserId.value = id
}

// parser version
export const overrideVersion = ref<string>()
export const displayVersion = ref<string>()
export const isUrlVersion = computed(() => isUrl(overrideVersion.value || ''))

export function initParserState() {
  // set code template when language changes
  watch(currentLanguage, (language) => {
    code.value = language.codeTemplate
  })

  // ensure currentParserId is valid
  watch(
    [currentLanguage, currentParserId],
    () => {
      if (
        !currentParserId.value ||
        !currentLanguage.value.parsers.some(
          (p) => p.id === currentParserId.value,
        )
      ) {
        setParserId(currentLanguage.value.parsers[0].id)
      }
    },
    { immediate: true, flush: 'sync' },
  )
}
