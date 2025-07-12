import { currentParsers } from './parser/parser'

// Do we need editorLayout to control whether to initialize one or multiple?
export const hideEmptyKeys = useLocalStorage<boolean[]>(
  `${STORAGE_PREFIX}hide-empty-keys`,
  [false, false],
)

export const hideLocationData = useLocalStorage<boolean[]>(
  `${STORAGE_PREFIX}hide-location-data`,
  [false, false],
)

export const hideKeys = useLocalStorage<string[]>(
  `${STORAGE_PREFIX}hide-keys`,
  [],
)

export const autoFocus = useLocalStorage<boolean[]>(
  `${STORAGE_PREFIX}auto-focus`,
  [true, true],
)

export function shouldHideKey(
  index: number,
  key: any,
  checkValue = false,
  value?: any,
) {
  if (checkValue && hideEmptyKeys.value[index] && value == null) return true
  if (hideLocationData.value[index] && locationKeyList.includes(key))
    return true
  if (hideKeys.value.includes(key)) return true
  return currentParsers.value[index]!.hideKeys?.includes(key)
}
