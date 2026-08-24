import json5 from 'json5'
import { currentParser, currentParserId } from './parser'

export const rawOptions = ref('')

const rawOptionsByParser = new Map<string, string>()

const parsedOptions = computed<{ value?: any; error?: unknown }>(() => {
  try {
    const value =
      currentParser.value.options.defaultValueType === 'javascript'
        ? new Function('code', rawOptions.value)(code.value)
        : json5.parse(rawOptions.value)
    return { value }
  } catch (error) {
    return { error }
  }
})

export const parserOptionsError = computed(() => parsedOptions.value.error)

export const parserOptions = computed({
  get: () => parsedOptions.value.value,
  set(value) {
    rawOptions.value = JSON.stringify(value, undefined, 2)
  },
})

export function setDefaultOptions() {
  rawOptions.value =
    currentParser.value.options.defaultValueType === 'javascript'
      ? currentParser.value.options.defaultValue
      : JSON.stringify(currentParser.value.options.defaultValue, null, 2)
}

export function useOptions<O extends object, T>(
  read: (opt: O | undefined) => T,
  write: (value: T, opt: O) => void,
) {
  return computed<T>({
    get: () => read(parserOptions.value),
    set(value) {
      const newOpt: O =
        typeof parserOptions.value === 'object' ? parserOptions.value : {}
      write(value, newOpt)
      parserOptions.value = { ...newOpt }
    },
  })
}

export function initParserOptionsState() {
  watch(
    currentParserId,
    (parserId, previousParserId) => {
      if (previousParserId) {
        rawOptionsByParser.set(previousParserId, rawOptions.value)
      }

      const savedOptions = parserId
        ? rawOptionsByParser.get(parserId)
        : undefined
      if (savedOptions === undefined) setDefaultOptions()
      else rawOptions.value = savedOptions
    },
    { flush: 'sync' },
  )
}
