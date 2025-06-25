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
  console.log('currentParsers',currentParserIds)
  const { parsers } = currentLanguage.value
  return [findParser(currentParserIds.value[0], parsers), findParser(currentParserIds.value[1], parsers)]
})

export const currentParsersGui = computed(
  () =>
    currentParsers.value.gui && defineAsyncComponent(currentParsers.value.gui),
)

export function setParserId(id: string ,idx: number) {
  overrideVersion.value = undefined
  console.log('setParserId', idx)
  currentParserIds.value[idx] = id
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

  // ensure currentParsersId is valid
  watch(
    [currentLanguage, currentParserIds],
    () => {
      if (
        !currentParserIds.value ||
        !currentLanguage.value.parsers.some(
          (p) => p.id === currentParserIds.value,
        )
      ) {
        setParserId(currentLanguage.value.parsers[0]!.id)
      }
    },
    { immediate: true, flush: 'sync' },
  )
}
