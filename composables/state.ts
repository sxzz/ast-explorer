import json5 from 'json5'
import { type Language } from './language'

const PREFIX = 'ast-explorer:'

export const loading = ref<'load' | 'parse' | false>(false)
export const code = ref('')
export const ast = shallowRef<any>({})
export const error = shallowRef<any>()
export const rawOptions = ref('')

export const hideEmptyKeys = useLocalStorage(`${PREFIX}hide-empty-keys`, true)
export const hideLocationData = useLocalStorage(
  `${PREFIX}hide-location-data`,
  true
)
export const hideKeys = useLocalStorage<string[]>(`${PREFIX}hide-keys`, [])

export const currentLanguageId = ref<Language>('javascript')
export const currentParserId = ref<string | undefined>(undefined)

export const options = computed(() => {
  try {
    return json5.parse(rawOptions.value)
  } catch {
    return null
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
    rawOptions.value = JSON.stringify(
      currentParser.value.options.defaultValue,
      undefined,
      2
    )
  },
  { immediate: !rawUrlState }
)

export const parserContextMap: Record<string, any> = reactive(
  Object.create(null)
)
async function initParser() {
  const { id, init } = currentParser.value
  if (parserContextMap[id]) return parserContextMap[id]
  return (parserContextMap[id] = await init?.())
}

watch(
  [currentParserId, code, rawOptions],
  async () => {
    parserVersion.value = ''
    loading.value = 'load'
    try {
      const ctx = await initParser()

      if (typeof currentParser.value.version === 'string') {
        parserVersion.value = currentParser.value.version
      } else {
        Promise.resolve(currentParser.value.version.call(ctx)).then(
          (version) => (parserVersion.value = version)
        )
      }

      loading.value = 'parse'
      ast.value = await currentParser.value.parse.call(
        ctx,
        code.value,
        json5.parse(rawOptions.value)
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
