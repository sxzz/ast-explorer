import { rawOptions, setDefaultOptions } from './parser/options'
import {
  currentLanguage,
  currentLanguageId,
  currentParser,
  currentParserId,
  overrideVersion,
} from './parser/parser'

export function initUrlState() {
  const rawUrlState = atou(location.hash!.slice(1))
  const urlState = rawUrlState && JSON.parse(rawUrlState)
  if (urlState) {
    currentLanguageId.value = urlState.l
    currentParserId.value = urlState.p
    rawOptions.value = urlState.o
    overrideVersion.value = urlState.v
  } else {
    setDefaultOptions()
  }
  code.value = urlState?.c || currentLanguage.value.codeTemplate

  // serialize state to url
  watchEffect(() => {
    // code
    const c =
      code.value === currentLanguage.value.codeTemplate ? '' : code.value
    const serialized = JSON.stringify({
      l: currentLanguageId.value,
      p: currentParser.value.id,
      c,
      o: rawOptions.value,
      v: overrideVersion.value,
    })
    location.hash = utoa(serialized)
  })
}

export function isUrl(text: string) {
  return /https?:\/\//.test(text)
}
