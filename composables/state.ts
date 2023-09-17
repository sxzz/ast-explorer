import json5 from 'json5'
import { type Language } from '#imports'

const PREFIX = 'ast-explorer:'

export const loading = ref<'load' | 'parse' | false>(false)
export const code = ref('')
export const ast = shallowRef<unknown>({})
export const error = shallowRef<unknown>()
export const rawOptions = ref('')

export const hideEmptyKeys = useLocalStorage(`${PREFIX}hide-empty-keys`, true)
export const hideLocationData = useLocalStorage(
  `${PREFIX}hide-location-data`,
  true
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
      `Failed to parse options: ${JSON.stringify(rawOptions.value, null, 2)}`
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
}
watch([currentLanguageId, currentParserId, code, rawOptions], () => {
  const serialized = JSON.stringify({
    l: currentLanguageId.value,
    p: currentParserId.value,
    c: code.value,
    o: rawOptions.value,
  })
  location.value.hash = utoa(serialized)
})

watch(
  [currentLanguage, currentParserId],
  () => {
    if (
      !currentParserId.value ||
      !currentLanguage.value.parsers.some((p) => p.id === currentParserId.value)
    )
      currentParserId.value = currentLanguage.value.parsers[0].id
  },
  { immediate: true }
)

watch(
  currentParserId,
  () => {
    rawOptions.value =
      currentParser.value.options.defaultValueType === 'javascript'
        ? currentParser.value.options.defaultValue
        : JSON.stringify(currentParser.value.options.defaultValue, null, 2)
  },
  { immediate: !rawUrlState }
)

export const parserContextMap: Record<string, unknown> = shallowReactive(
  Object.create(null)
)
async function initParser() {
  const { id, init } = currentParser.value
  if (parserContextMap[id]) return parserContextMap[id]
  return (parserContextMap[id] = await init?.())
}

const parserContext = computed(() => initParser())

watchEffect(() => {
  parserVersion.value = ''
  if (typeof currentParser.value.version === 'string') {
    parserVersion.value = currentParser.value.version
  } else {
    Promise.resolve(currentParser.value.version.call(parserContext.value)).then(
      (version) => (parserVersion.value = version)
    )
  }
})

watch(
  [parserContext, currentParser, code, rawOptions],
  async () => {
    try {
      loading.value = 'load'
      const ctx = await parserContext.value
      loading.value = 'parse'
      ast.value = await currentParser.value.parse.call(
        await ctx,
        code.value,
        options.value
      )
      error.value = null
      // eslint-disable-next-line unicorn/catch-error-name
    } catch (err) {
      error.value = err
      console.error(err)
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)
