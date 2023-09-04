<script setup lang="ts">
import json5 from 'json5'
import { hideEmptyKeys, hideLocationData, loading } from '#imports'

const IS_SAFARI = /Apple Computer/.test(globalThis.navigator?.vendor)

const serialized = computed(() => {
  try {
    return JSON.stringify(
      ast.value,
      (key: string, value: unknown) => {
        if (key === 'parseDiagnostics') return
        if (hideEmptyKeys.value && value == null) return
        if (
          [
            ...(hideLocationData.value ? ['loc', 'start', 'end', 'span'] : []),
            ...hideKeys.value.filter((v) => !!v),
          ].includes(key)
        )
          return
        if (typeof value === 'function') return `function ${value.name}(...)`
        if (typeof value === 'bigint') return `(BigInt) ${value}n`
        return value
      },
      2
    )
    // eslint-disable-next-line unicorn/catch-error-name
  } catch (err) {
    console.error(err)
    error.value = err
  }
})

const hideKeysValue = ref(JSON.stringify(hideKeys.value))

watchEffect(() => {
  try {
    hideKeys.value = json5.parse(hideKeysValue.value)
  } catch (error) {
    console.error(error)
    hideKeys.value = []
  }
})

function stringifyError(error: unknown) {
  if (error instanceof Error) {
    if (IS_SAFARI)
      return `${error}\n${error.stack
        ?.split('\n')
        .map((line) => {
          const [fn, file] = line.split('@', 2)
          return `${' '.repeat(4)}at ${fn} (${file})`
        })
        .join('\n')}`
    return error.stack
  }
  return String(error)
}

function print() {
  // eslint-disable-next-line no-console
  console.info(ast.value)
}
</script>

<template>
  <div flex="~ col gap-2 1" min-w-0>
    <div flex="~ gap-3 wrap" items-center>
      <label>
        <input v-model="hideEmptyKeys" type="checkbox" /> Hide empty keys
      </label>
      <label>
        <input v-model="hideLocationData" type="checkbox" /> Hide location data
      </label>
      <label>
        Hide keys:
        <input
          v-model="hideKeysValue"
          type="input"
          border="~ $c-border"
          rounded
          p1
        />
      </label>
      <button border rounded px2 py1 hover:border-emerald @click="print">
        Print in console
      </button>
    </div>
    <div flex="~ 1" min-h-0 min-w-0>
      <div v-if="loading === 'load'">Loading parser...</div>
      <div v-else-if="loading === 'parse'">Parsing...</div>
      <div v-else-if="error" overflow-scroll text-red>
        <pre v-text="stringifyError(error)" />
      </div>
      <MonacoEditor
        v-else
        min-w-0
        flex-1
        lang="json"
        :model-value="serialized"
        :options="{
          automaticLayout: true,
          theme: isDark ? 'vs-dark' : 'vs',
          readOnly: true,
          fontSize: 14,
          tabSize: 2,
          minimap: {
            enabled: false,
          },
        }"
      />
    </div>
  </div>
</template>
