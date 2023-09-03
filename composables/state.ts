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

export const currentLanguageId = useLocalStorage<Language>(
  `${PREFIX}language`,
  'javascript'
)

export const currentParserId = useLocalStorage<string | undefined>(
  `${PREFIX}parser`,
  undefined
)

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
  code.value = urlState.c
  rawOptions.value = urlState.o
}

watch([code, rawOptions], () => {
  location.value.hash = utoa(
    JSON.stringify({
      c: code.value,
      o: rawOptions.value,
    })
  )
})
