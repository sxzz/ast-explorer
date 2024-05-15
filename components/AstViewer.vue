<script setup lang="ts">
import { autoFocus, hideEmptyKeys, hideLocationData, loading } from '#imports'
import type * as Monaco from 'monaco-editor'
import type { MonacoEditor } from '#build/components'

const container = shallowRef<InstanceType<typeof MonacoEditor>>()
const monaco = useMonaco()!
const IS_SAFARI = /Apple Computer/.test(globalThis.navigator?.vendor)

const serialized = computed(() => {
  try {
    const seen = new WeakMap<any, unknown>()
    return JSON.stringify(
      ast.value,
      (key: string, value: unknown) => {
        if (hideEmptyKeys.value && value == null) return
        if (
          [
            ...(hideLocationData.value
              ? ['loc', 'start', 'end', 'span', 'range']
              : []),
            ...hideKeys.value.filter((v) => !!v),
          ].includes(key)
        )
          return
        if (typeof value === 'function') return `function ${value.name}(...)`
        if (typeof value === 'bigint') return `(BigInt) ${value}n`

        if (seen.has(value)) {
          return seen.get(value)
        }

        if (value !== null && typeof value === 'object') {
          let newValue: any
          try {
            JSON.stringify(value)
            newValue = value
          } catch {
            newValue = `(circular: ${key || '#root'})`
          }
          seen.set(value, newValue)
        }

        return value
      },
      2,
    )
    // eslint-disable-next-line unicorn/catch-error-name
  } catch (err) {
    console.error(err)
    error.value = err
  }
})

const hideKeysValue = ref(hideKeys.value.join(', '))

watchEffect(() => {
  try {
    hideKeys.value = hideKeysValue.value.split(',').map((v) => v.trim())
  } catch (error) {
    console.error(error)
    hideKeys.value = []
  }
})

/** AST range -> code range */
const positionMap = computed(() =>
  serialized.value
    ? collectPositionMap(serialized.value, currentParser.value)
    : undefined,
)

const highlightRange = computed(() => {
  if (!positionMap.value) return
  return Array.from(positionMap.value.entries()).findLast(
    ([, { start, end }]) =>
      start <= editorCursor.value! && end >= editorCursor.value!,
  )?.[0]
})

let decorationsCollection:
  | Monaco.editor.IEditorDecorationsCollection
  | undefined

function highlight() {
  decorationsCollection?.clear()

  const range = highlightRange.value
  if (!range) return

  const editor: Monaco.editor.IStandaloneCodeEditor | undefined = toRaw(
    container.value?.$editor,
  )
  if (!editor) return

  const start = editor.getModel()!.getPositionAt(range.start)
  const end = editor.getModel()!.getPositionAt(range.end)

  decorationsCollection = editor.createDecorationsCollection([
    {
      range: monaco.Range.fromPositions(start, end),
      options: {
        className: `important-bg-yellow-400 important-bg-opacity-30`,
      },
    },
  ])
  if (autoFocus.value) editor.revealPositionNearTop(start)
}

onMounted(() => highlight())
watch(highlightRange, () => highlight(), {
  immediate: true,
  flush: 'post',
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
  <div flex="~ col gap-2">
    <div flex="~ gap-3 wrap" items-center text-sm>
      <div v-if="!showLeftLayout" />
      <label flex="~ gap1" items-center>
        <input v-model="autoFocus" type="checkbox" switch /> Auto focus
      </label>
      <label flex="~ gap1" items-center>
        <input v-model="hideEmptyKeys" type="checkbox" switch /> Hide empty keys
      </label>
      <label flex="~ gap1" items-center>
        <input v-model="hideLocationData" type="checkbox" switch /> Hide
        location data
      </label>
      <label>
        Hide keys:
        <input
          v-model="hideKeysValue"
          type="input"
          placeholder="field1, field2, ..."
        />
      </label>
      <button
        flex
        items-center
        gap1
        border
        rounded
        px1
        py0.5
        text-sm
        hover:border-current
        @click="print"
      >
        <div i-ri:printer-line />
        Print in Console
      </button>
    </div>
    <div flex="~ 1" min-h-0 min-w-0>
      <div v-if="loading === 'load'">Loading parser...</div>
      <div v-else-if="loading === 'parse'">Parsing...</div>
      <div v-else-if="error" overflow-scroll text-red>
        <pre v-text="stringifyError(error)" />
      </div>
      <MonacoEditor
        v-show="!loading && !error"
        ref="container"
        h-full
        min-w-0
        w-full
        max-sm:min-h-50vh
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
