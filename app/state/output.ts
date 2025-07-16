import { currentParser } from './parser/parser'

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

export const autoFocus = useLocalStorage<boolean>(
  `${STORAGE_PREFIX}auto-focus`,
  true,
)

export function shouldHideKey(key: any, checkValue = false, value?: any) {
  if (checkValue && hideEmptyKeys.value && value == null) return true
  if (hideLocationData.value && locationKeyList.includes(key)) return true
  if (hideKeys.value.includes(key)) return true
  return currentParser.value.hideKeys?.includes(key)
}
