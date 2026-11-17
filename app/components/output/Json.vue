<script setup lang="ts">
import { computed, onMounted, shallowRef, toRaw, watch } from 'vue'
import Loading from '~/components/Loading.vue'
import { getLocationMapping, isRegExp } from '~/composables/location'
import { loadedMonaco, useMonacoLanguage } from '~/composables/monaco'
import { editorCursor, getSharedMonacoOptions } from '~/state/editor'
import { autoFocus, shouldHideKey } from '~/state/output'
import { ast, astParser, error } from '~/state/parser/module'
import type { MonacoEditor } from '#build/components'
import type * as Monaco from 'monaco-editor'

const container = shallowRef<InstanceType<typeof MonacoEditor>>()
const editorLanguage = useMonacoLanguage('json')
const options = computed(() => ({
  ...getSharedMonacoOptions(),
  readOnly: true,
}))

const serialized = computed(() => {
  try {
    const seen = new WeakMap<any, unknown>()
    return JSON.stringify(
      ast.value,
      (key: string, value: unknown) => {
        if (shouldHideKey(key, true, value)) return
        if (typeof value === 'function') return `function ${value.name}(...)`
        if (typeof value === 'bigint') return `(BigInt) ${value}n`
        if (isRegExp(value)) return `(RegExp) ${value}`

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
  } catch (err) {
    console.error(err)
    error.value = err
    return undefined
  }
})

/** AST range -> code range */
const positionMap = computed(() =>
  serialized.value && astParser.value
    ? getLocationMapping(serialized.value, astParser.value)
    : undefined,
)

const highlightRange = computed(() => {
  if (!positionMap.value) return
  return Array.from(positionMap.value.entries()).findLast(
    ([, [start, end]]) =>
      start <= editorCursor.value! && end >= editorCursor.value!,
  )?.[0]
})

let decorationsCollection:
  Monaco.editor.IEditorDecorationsCollection | undefined

function highlight() {
  decorationsCollection?.clear()

  const range = highlightRange.value
  if (!range) return

  const editor: Monaco.editor.IStandaloneCodeEditor | undefined = toRaw(
    container.value?.$editor,
  )
  if (!editor) return

  const start = editor.getModel()!.getPositionAt(range[0])
  const end = editor.getModel()!.getPositionAt(range[1])

  decorationsCollection = editor.createDecorationsCollection([
    {
      range: loadedMonaco.value!.Range.fromPositions(start, end),
      options: { className: 'ast-highlight' },
    },
  ])
  if (autoFocus.value) editor.revealPositionNearTop(start)
}

onMounted(() => highlight())
watch([highlightRange, () => container.value?.$editor], () => highlight(), {
  immediate: true,
  flush: 'post',
})
</script>

<template>
  <MonacoEditor
    v-if="editorLanguage"
    ref="container"
    :lang="editorLanguage"
    :model-value="serialized"
    :options
  >
    <Loading />
  </MonacoEditor>
  <Loading v-else />
</template>
