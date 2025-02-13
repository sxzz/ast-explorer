import json5 from 'json5'
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

export const isUrlVersion = computed(() => isUrl(overrideVersion.value || ''))

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

export const sideBarAvailable = computed(
  () => currentParser.value.options.configurable && !!currentParserGui.value,
)

const location = useBrowserLocation()
const rawUrlState = import.meta.client
  ? atou(location.value.hash!.slice(1))
  : undefined
const urlState = rawUrlState && JSON.parse(rawUrlState)
if (rawUrlState) {
  currentLanguageId.value = urlState.l
  currentParserId.value = urlState.p
  rawOptions.value = urlState.o
  overrideVersion.value = urlState.v
}
code.value = urlState?.c || currentLanguage.value.codeTemplate

export function setParserId(id: string) {
  overrideVersion.value = undefined
  currentParserId.value = id
}

function isUrl(text: string) {
  return /https?:\/\//.test(text)
}

const parserModuleCache: Record<string, unknown> = Object.create(null)
async function initParser() {
  const defaultModuleUrl = (pkg: string) => getJsdelivrUrl(pkg)
  const defaultInit = (url: string) => importUrl(url)
  const {
    pkgName,
    getModuleUrl = defaultModuleUrl,
    init = defaultInit,
  } = currentParser.value

  const pkgId = isUrlVersion.value
    ? overrideVersion.value!
    : `${pkgName}${overrideVersion.value ? `@${overrideVersion.value}` : ''}`
  if (parserModuleCache[pkgId]) return parserModuleCache[pkgId]

  const moduleUrl = isUrlVersion.value
    ? pkgId
    : getModuleUrl(pkgId, overrideVersion.value)
  return (parserModuleCache[pkgId] = await init(moduleUrl, pkgId))
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
        if (!isUrl(overrideVersion.value)) {
          displayVersion.value = await fetchVersion(
            `${currentParser.value.pkgName}@${displayVersion.value}`,
          )
        }
        return
      }

      const parser = currentParser.value
      if (typeof parser.version === 'string') {
        displayVersion.value = parser.version
      } else {
        displayVersion.value = ''
        const res = await Promise.resolve(
          (parser.version || (fetchVersion as never)).call(
            parserModulePromise.value,
            parser.pkgName,
            overrideVersion.value,
          ),
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
      const id = currentParser.value.id
      try {
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
        console.error(err)
        if (currentParser.value.id === id) {
          error.value = err
        }
      } finally {
        loading.value = false
      }
    },
    { immediate: true },
  )
}
