import json5 from 'json5'
import type { Language } from '#imports'

const PREFIX = 'ast-explorer:'

export const loading = ref<'load' | 'parse' | false>(false)
export const code = ref('')
export const ast = shallowRef<unknown>({})
export const error = shallowRef<unknown>()
export const rawOptions = ref('')
export const parseCost = ref(0)

export const showLeftLayout = useLocalStorage('show-left-layout', true)
export const showRightLayout = useLocalStorage('show-right-layout', true)

export const hideEmptyKeys = useLocalStorage(`${PREFIX}hide-empty-keys`, true)
export const hideLocationData = useLocalStorage(
  `${PREFIX}hide-location-data`,
  false,
)
export const hideKeys = useLocalStorage<string[]>(`${PREFIX}hide-keys`, [])
export const autoFocus = useLocalStorage<boolean>(`${PREFIX}auto-focus`, true)

export const currentLanguageId = ref<Language>('javascript')
export const currentParserId = ref<string | undefined>(undefined)

export const options = computed(() => {
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
})

const location = useBrowserLocation()

const rawUrlState = atou(location.value.hash!.slice(1))

if (rawUrlState) {
  const urlState = JSON.parse(rawUrlState)
  currentLanguageId.value = urlState.l
  currentParserId.value = urlState.p
  code.value = urlState.c
  rawOptions.value = urlState.o
  overrideVersion.value = urlState.v
}

// serialize state to url
watchEffect(() => {
  const serialized = JSON.stringify({
    l: currentLanguageId.value,
    p: currentParserId.value,
    c: code.value,
    o: rawOptions.value,
    v: overrideVersion.value,
  })
  location.value.hash = utoa(serialized)
})

// ensure currentParserId is valid
watch(
  [currentLanguage, currentParserId],
  () => {
    if (
      !currentParserId.value ||
      !currentLanguage.value.parsers.some((p) => p.id === currentParserId.value)
    )
      setParserId(currentLanguage.value.parsers[0].id)
  },
  { immediate: true },
)

export function setParserId(id: string) {
  overrideVersion.value = undefined
  currentParserId.value = id
}

// set default options
watch(
  currentParserId,
  () => {
    rawOptions.value =
      currentParser.value.options.defaultValueType === 'javascript'
        ? currentParser.value.options.defaultValue
        : JSON.stringify(currentParser.value.options.defaultValue, null, 2)
  },
  { immediate: !rawUrlState },
)

const parserContextCache: Record<string, unknown> = Object.create(null)
async function initParser() {
  const { pkgName, init } = currentParser.value
  const pkgId = `${pkgName}${overrideVersion.value ? `@${overrideVersion.value}` : ''}`
  if (parserContextCache[pkgId]) return parserContextCache[pkgId]
  return (parserContextCache[pkgId] = await init?.(pkgId))
}

const parserContextPromise = computed(() => initParser())

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
      Promise.resolve(
        parser.version.call(parserContextPromise.value, parser.pkgName),
      ).then((version) => (displayVersion.value = version))
    }
  },
  { immediate: true },
)

watch(
  [parserContextPromise, currentParser, code, rawOptions],
  async () => {
    try {
      loading.value = 'load'
      const ctx = await parserContextPromise.value
      loading.value = 'parse'
      const t = window.performance.now()
      ast.value = await currentParser.value.parse.call(
        await ctx,
        code.value,
        options.value,
      )
      parseCost.value = window.performance.now() - t
      error.value = null
      // eslint-disable-next-line unicorn/catch-error-name
    } catch (err) {
      error.value = err
      console.error(err)
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
