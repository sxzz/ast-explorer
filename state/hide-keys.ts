export function shouldHideKey(key: any, value?: any) {
  if (hideEmptyKeys.value && value == null) return true
  if (hideLocationData.value && locationKeyList.includes(key)) return true
  return hideKeys.value.includes(key)
}
