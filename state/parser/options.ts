import { currentParsers, currentParserIds } from './parser'
import json5 from 'json5'

export const rawOptions = ref<Record<string, any>>({})
export const parsersOptions = ref<Record<string, any>>({})  

export function setDefaultOptions(parserId?: string) {
  if(parserId) {
    const parser = currentParsers.value.find((p) => p.id === parserId)
    rawOptions.value[parserId] =
      parser.options.defaultValueType === 'javascript'
        ? parser.options.defaultValue
        : JSON.stringify(parser.options.defaultValue, null, 2)
  }else {
    currentParsers.value.forEach(parser => {
      rawOptions.value[parser?.id] =
      parser.options.defaultValueType === 'javascript'
        ? parser.options.defaultValue
        : JSON.stringify(parser.options.defaultValue, null, 2)
    })
  }
}

export function useOptions<O extends object, T>(
  read: (opt: O | undefined) => T,
  write: (value: T, opt: O) => void,
  parserId: string,
) {
  return computed<T>({
    get: () => {
      const parserOptions = parsersOptions.value[parserId]
      return read(parserOptions)
    } ,
    set(value) {
      const parserOptions = parsersOptions.value[parserId]
      const newOpt: O =
        typeof parserOptions === 'object' ? parserOptions : {}
      write(value, newOpt)
      parsersOptions.value[parserId] = { ...newOpt }
      console.log('setOptions', parsersOptions.value)
    },
  })
}

export function initParserOptionsState() {
  // set default options
  watch(currentParserIds, () => {
    console.log('setrawOptions')
    currentParserIds.value.forEach((id) => {
      setDefaultOptions(id)
    })
  }, {
    deep: true,
    flush: 'sync'
  })

  // generate parsersOptions
  watch([currentParsers, rawOptions],() => {
    console.log('set parsersOptions', rawOptions.value)
    currentParsers.value.forEach(parser => {
      try{
        const parserId = parser.id
        parsersOptions.value[parser.id] = parser.options.defaultValueType === 'javascript'
        ? // TODO: use a better way to eval
          new Function(rawOptions.value[parserId])()
        : json5.parse(rawOptions.value[parserId])
      }catch {
        console.error(
          `Failed to parse options: ${JSON.stringify(rawOptions.value[parser.id], null, 2)}`,
        )
      }
    })
  }, {
    immediate: true
  })

  // change rawOptions
  watch(parsersOptions, (newVal) => {
    for(const [parserId, parserOptions] of Object.entries(newVal)) {
      rawOptions.value[parserId] = JSON.stringify(parserOptions, null, 2)
    }
  }, {
    deep: true
  })
}
