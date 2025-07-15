import { rawOptions, setDefaultOptions } from './parser/options'
import {
  currentLanguage,
  currentLanguageId,
  currentParserIds,
  currentParsers,
  editorLayout,
  overrideVersions,
} from './parser/parser'

const LAST_STATE_KEY = `${STORAGE_PREFIX}last-state`

export function initUrlState() {
  const serializedUrl = atou(location.hash!.slice(1))
  let state = serializedUrl && JSON.parse(serializedUrl)
  if (!state) {
    const serialized = localStorage.getItem(LAST_STATE_KEY)
    if (serialized) state = JSON.parse(serialized)
  }
  if (state) {
    currentLanguageId.value = state.l
    currentParserIds.value = state.p
    rawOptions.value = state.o
    overrideVersions.value = state.v
    editorLayout.value = state.s
  } else {
    setDefaultOptions()
  }
  code.value = state?.c || currentLanguage.value.codeTemplate

  // serialize state to url
  watchEffect(() => {
    // code
    const c =
      code.value === currentLanguage.value.codeTemplate ? '' : code.value
    const serialized = JSON.stringify({
      l: currentLanguageId.value,
      p: currentParsers.value.map((parser) => parser?.id),
      c,
      o: rawOptions.value,
      v: overrideVersions.value,
      s: editorLayout.value,
    })
    location.hash = utoa(serialized)
    localStorage.setItem(LAST_STATE_KEY, serialized)
  })
}

export function isUrl(text: string) {
  return /https?:\/\//.test(text)
}
