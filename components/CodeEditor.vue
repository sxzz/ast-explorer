<script setup lang="ts">
import type { MonacoLanguage } from '#imports'
import type * as monaco from 'monaco-editor'
import type { MonacoEditor } from '#build/components'

const props = defineProps<{
  language: MonacoLanguage
  input?: boolean
}>()
const code = defineModel<string>()

const container = shallowRef<InstanceType<typeof MonacoEditor>>()

const options = computed<monaco.editor.IStandaloneEditorConstructionOptions>(
  () => ({
    ...getSharedMonacoOptions(),
    fontSize: 14,
    fontLigatures: true,
  }),
)

if (props.input)
  watchEffect(() => {
    const editor = toRaw(container.value?.$editor)
    if (!editor) return
    editor.onDidChangeCursorPosition((e) => {
      editorCursor.value = editor.getModel()!.getOffsetAt(e.position)
    })
  })

let decorationsCollection:
  | monaco.editor.IEditorDecorationsCollection
  | undefined

watchEffect(() => {
  if (hoverLocation.value) {
    decorationsCollection?.clear()
    decorationsCollection =
      container.value?.$editor?.createDecorationsCollection([
        {
          range: {
            startColumn: hoverLocation.value.startColumn,
            endColumn: hoverLocation.value.endColumn + 1,
            startLineNumber: hoverLocation.value.startLineNumber,
            endLineNumber: hoverLocation.value.endLineNumber,
          },
          options: {
            isWholeLine: false,
            className: 'monaco-bg-highlight',
          },
        },
      ])
  } else {
    decorationsCollection?.clear()
  }
})
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
.monaco-bg-highlight {
  --at-apply: 'bg-yellow-300/50 dark:bg-yellow-700/50';
}
</style>
