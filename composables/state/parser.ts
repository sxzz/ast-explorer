import json5 from 'json5'
import ansiRegex from 'ansi-regex'
import type { Language, Range } from '#imports'

export const loading = ref<'load' | 'parse' | false>(false)
export const code = ref('')
export const ast = shallowRef<unknown>({})
export const error = shallowRef<unknown>()
export const rawOptions = ref('')
export const parseCost = ref(0)
export const editorCursor = ref<number>(0)
export const outputHoverRange = ref<Range | undefined>()

export const currentLanguageId = ref<Language>('javascript')
export const currentParserId = ref<string | undefined>()

export const overrideVersion = ref<string>()
export const displayVersion = ref<string>()

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

export const currentParserGui = computed(
  () =>
    currentParser.value.gui && defineAsyncComponent(currentParser.value.gui),
)

export const parserOptions = computed({
  get() {
    try {
      return currentParser.value.options.defaultValueType === 'javascript'
        ? // TODO: use a better way to eval
          new Function(rawOptions.value)()
        : json5.parse(rawOptions.value)
    } catch {
      console.error(
        `Failed to parse options: ${JSON.stringify(rawOptions.value, null, 2)}`,
      )
    }
  },
  set(value) {
    rawOptions.value = JSON.stringify(value, undefined, 2)
  },
})

export const showSideBar = computed(
  () => currentParser.value.options.configurable && !!currentParserGui.value,
)

const location = useBrowserLocation()
const rawUrlState = import.meta.client
  ? atou(location.value.hash!.slice(1))
  : undefined
const urlState = rawUrlState && JSON.parse(rawUrlState)
code.value = urlState?.c || currentLanguage.value.codeTemplate
if (rawUrlState) {
  currentLanguageId.value = urlState.l
  currentParserId.value = urlState.p
  rawOptions.value = urlState.o
  overrideVersion.value = urlState.v
}

export function setParserId(id: string) {
  overrideVersion.value = undefined
  currentParserId.value = id
}

const parserModuleCache: Record<string, unknown> = Object.create(null)
async function initParser() {
  const { pkgName, init } = currentParser.value
  const pkgId = `${pkgName}${
    overrideVersion.value ? `@${overrideVersion.value}` : ''
  }`
  if (parserModuleCache[pkgId]) return parserModuleCache[pkgId]
  return (parserModuleCache[pkgId] = await init?.(pkgId))
}

const parserModulePromise = computed(() => initParser())
const parserModule = computedAsync(() => parserModulePromise.value)
export const parserContext = computedWithControl(parserModule, () => ({
  ...currentParser.value,
  module: parserModule.value,
}))

if (import.meta.client) {
  // serialize state to url
  watchEffect(() => {
    // code
    const c =
      code.value === currentLanguage.value.codeTemplate ? '' : code.value
    const serialized = JSON.stringify({
      l: currentLanguageId.value,
      p: currentParserId.value,
      c,
      o: rawOptions.value,
      v: overrideVersion.value,
    })
    location.value.hash = utoa(serialized)
  })

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
      )
        setParserId(currentLanguage.value.parsers[0].id)
    },
    { immediate: true, flush: 'sync' },
  )

  // set default options
  watch(
    currentParserId,
    () => {
      rawOptions.value =
        currentParser.value.options.defaultValueType === 'javascript'
          ? currentParser.value.options.defaultValue
          : JSON.stringify(currentParser.value.options.defaultValue, null, 2)
    },
    { immediate: !rawUrlState, flush: 'sync' },
  )

  // fetch display version
  watch(
    [currentParserId, overrideVersion],
    async () => {
      if (overrideVersion.value) {
        displayVersion.value = overrideVersion.value
        displayVersion.value = await fetchVersion(
          `${currentParser.value.pkgName}@${displayVersion.value}`,
        )
        return
      }

      const parser = currentParser.value
      if (typeof parser.version === 'string') {
        displayVersion.value = parser.version
      } else {
        displayVersion.value = ''
        const res = await Promise.resolve(
          parser.version.call(parserModulePromise.value, parser.pkgName),
        )
        if (currentParser.value.id === parser.id) {
          displayVersion.value = res
        }
      }
    },
    { immediate: true },
  )

  watch(
    [parserModulePromise, code, rawOptions],
    async () => {
      try {
        const id = currentParser.value.id
        loading.value = 'load'
        const ctx = await parserModulePromise.value
        if (currentParser.value.id !== id) return
        loading.value = 'parse'
        const t = window.performance.now()
        ast.value = await currentParser.value.parse.call(
          ctx,
          code.value,
          parserOptions.value,
        )
        parseCost.value = window.performance.now() - t
        error.value = null
        // eslint-disable-next-line unicorn/catch-error-name
      } catch (err: any) {
        error.value = `${err}`.replace(ansiRegex(), '')
        console.error(err)
      } finally {
        loading.value = false
      }
    },
    { immediate: true },
  )
}
