<script setup lang="ts">
import { AutoTypings, LocalStorageCache } from 'monaco-editor-auto-typings'
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
    fontLigatures: true,
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
      AutoTypings.create(editor, {
        sourceCache: new LocalStorageCache(),
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
    <div flex="~ col center" h-full w-full gap2>
      <div i-ri:loader-2-line animate-spin text-4xl />
      <span text-lg>Loading...</span>
    </div>
  </MonacoEditor>
</template>
