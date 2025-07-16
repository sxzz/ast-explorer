import json5 from 'json5'
import { currentParser, currentParserId } from './parser'

export const rawOptions = ref('')

export const parserOptions = computed({
  get() {
    try {
      return currentParser.value.options.defaultValueType === 'javascript'
        ? // TODO: use a better way to eval
          new Function(rawOptions.value)()
        : json5.parse(rawOptions.value)
    } catch {
      console.error(
        `Failed to parse options: ${JSON.stringify(rawOptions.value, null, 2)}`,
      )
    }
  },
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
  // set default options
  watch(currentParserId, setDefaultOptions, { flush: 'sync' })
}
