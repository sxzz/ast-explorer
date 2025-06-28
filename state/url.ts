// import { rawOptions, setDefaultOptions } from './parser/options'
import { rawOptions, setDefaultOptions } from './parser/options'
import {
  currentLanguage,
  currentLanguageId,
  currentParsers,
  currentParserIds,
  overrideVersion,
} from './parser/parser'
import { expLayout } from './ui'

const LAST_STATE_KEY = `${STORAGE_PREFIX}last-state`

export function initUrlState() {
  console.log('1.initUrlState')
  const serializedUrl = atou(location.hash!.slice(1))
  let state = serializedUrl && JSON.parse(serializedUrl)
  // if (!state) {
  //   const serialized = localStorage.getItem(LAST_STATE_KEY)
  //   if (serialized) state = JSON.parse(serialized)
  // }
  console.log('state', state)
  if (state) {
    currentLanguageId.value = state.l
    currentParserIds.value = state.p
    rawOptions.value = state.o
    overrideVersion.value = state.v
    expLayout.value = state.s
  } else {
    setDefaultOptions()
  }
  code.value = state?.c || currentLanguage.value.codeTemplate

  // serialize state to url
  watchEffect(() => {
    console.log(currentParsers.value)
    // code
    const c =
      code.value === currentLanguage.value.codeTemplate ? '' : code.value
    const serialized = JSON.stringify({
      l: currentLanguageId.value,
      p: currentParsers.value.map(parser => parser?.id),
      c,
      o: rawOptions.value,
      v: overrideVersion.value,
      s: expLayout.value
    })
    location.hash = utoa(serialized)
    // localStorage.setItem(LAST_STATE_KEY, serialized)
  })
}

export function isUrl(text: string) {
  return /https?:\/\//.test(text)
}
