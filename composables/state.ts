import json5 from 'json5'
import type { Language } from './language'

const PREFIX = 'ast-explorer:'

export const code = useLocalStorage(`${PREFIX}code`, '')
export const ast = shallowRef<any>({})
export const error = shallowRef<any>()
export const rawOptions = useLocalStorage<string>(`${PREFIX}options`, '')

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

export const options = computed(() => {
  try {
    return json5.parse(rawOptions.value)
  } catch {
    return null
  }
})
