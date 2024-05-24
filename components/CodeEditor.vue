<script setup lang="ts">
import type { MonacoLanguage } from '#imports'
import type * as Monaco from 'monaco-editor'
import type { MonacoEditor } from '#build/components'

const props = defineProps<{
  language: MonacoLanguage
  input?: boolean
}>()
const code = defineModel<string>()

const container = shallowRef<InstanceType<typeof MonacoEditor>>()

const options = computed<Monaco.editor.IStandaloneEditorConstructionOptions>(
  () => ({
    ...getSharedMonacoOptions(),
    fontSize: 14,
    fontLigatures: true,
  }),
)

if (props.input) {
  watchEffect(() => {
    const editor = toRaw(container.value?.$editor)
    if (!editor) return
    editor.onDidChangeCursorPosition((e) => {
      editorCursor.value = editor.getModel()!.getOffsetAt(e.position)
    })
  })

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
            className: 'input-editor-highlight',
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

<style>
.input-editor-highlight {
  --at-apply: 'bg-yellow-400/30 dark:bg-yellow-600/30';
}
</style>
