import { useLocalStorage } from '@vueuse/core'
import { locationKeyList } from '~/composables/location'
import { STORAGE_PREFIX } from '~/state/constants'
import { astParser } from './parser/module'

export const hideEmptyKeys = useLocalStorage(
  `${STORAGE_PREFIX}hide-empty-keys`,
  false,
)

export const hideLocationData = useLocalStorage(
  `${STORAGE_PREFIX}hide-location-data`,
  false,
)

export const hideKeys = useLocalStorage<string[]>(
  `${STORAGE_PREFIX}hide-keys`,
  [],
)
// the old free-text field stored blanks, e.g. `['']` when left empty
if (hideKeys.value.some((key) => !key)) {
  hideKeys.value = hideKeys.value.filter(Boolean)
}

export const autoFocus = useLocalStorage<boolean>(
  `${STORAGE_PREFIX}auto-focus`,
  true,
)

export function shouldHideKey(key: any, checkValue = false, value?: any) {
  if (checkValue && hideEmptyKeys.value && value == null) return true
  if (hideLocationData.value && locationKeyList.includes(key)) return true
  if (hideKeys.value.includes(key)) return true
  return astParser.value?.hideKeys?.includes(key)
}
