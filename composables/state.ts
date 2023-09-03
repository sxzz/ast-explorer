import json5 from 'json5'
import { type Language } from './language'

const PREFIX = 'ast-explorer:'

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
      !Object.keys(currentLanguage.value.parsers).includes(
        currentParserId.value
      )
    )
      currentParserId.value = Object.keys(currentLanguage.value.parsers)[0]
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

export const initted: Record<string, boolean> = Object.create(null)
async function initParser() {
  const { id, init } = currentParser.value
  if (initted[id]) return
  initted[id] = true
  await init?.()
}

watch(
  [currentParserId, code, rawOptions],
  async () => {
    try {
      await initParser()
      ast.value = await currentParser.value.parse(
        code.value,
        json5.parse(rawOptions.value)
      )
      error.value = null
      // eslint-disable-next-line unicorn/catch-error-name
    } catch (err) {
      error.value = err
    }
  },
  { immediate: true }
)
