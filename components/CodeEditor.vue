<script setup lang="ts">
import type { MonacoLanguage } from '#imports'
import type * as Monaco from 'monaco-editor'

const props = defineProps<{
  language: MonacoLanguage
  input?: boolean
}>()
const code = defineModel<string>()

const container = shallowRef<{
  $editor: Monaco.editor.IStandaloneCodeEditor | undefined
}>()

const options = computed<Monaco.editor.IStandaloneEditorConstructionOptions>(
  () => ({
    ...getSharedMonacoOptions(),
    fontSize: 14,
  }),
)

if (props.input) {
  watch(
    () => container.value?.$editor,
    (editor) => {
      if (!editor) return

      editor.onDidChangeCursorPosition((e) => {
        editorCursor.value = editor.getModel()!.getOffsetAt(e.position)
      })
    },
    { immediate: true },
  )

  let decorationsCollection:
    | Monaco.editor.IEditorDecorationsCollection
    | undefined

  const monaco = useMonaco()!
  watchEffect(() => {
    const editor = container.value?.$editor
    if (!editor) return

    if (outputHoverRange.value) {
      decorationsCollection?.clear()
      const start = editor.getModel()!.getPositionAt(outputHoverRange.value[0])
      const end = editor.getModel()!.getPositionAt(outputHoverRange.value[1])

      decorationsCollection = editor.createDecorationsCollection([
        {
          range: monaco.Range.fromPositions(start, end),
          options: {
            isWholeLine: false,
            className: 'ast-highlight',
          },
        },
      ])
    } else {
      decorationsCollection?.clear()
    }
  })
}
</script>

<template>
  <MonacoEditor
    ref="container"
    v-model="code"
    :lang="language"
    :options="options"
  >
    <Loading />
  </MonacoEditor>
</template>
