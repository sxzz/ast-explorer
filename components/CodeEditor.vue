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
    if (!container.value) return

    if (hoverLocation.value) {
      decorationsCollection?.clear()

      const start = container.value
        ?.$editor!.getModel()!
        .getPositionAt(hoverLocation.value.start!)
      const end = container.value
        ?.$editor!.getModel()!
        .getPositionAt(hoverLocation.value.end!)

      decorationsCollection =
        container.value?.$editor?.createDecorationsCollection([
          {
            range: monaco.Range.fromPositions(start, end),
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
.monaco-bg-highlight {
  --at-apply: 'bg-yellow-400/30 dark:bg-yellow-600/30';
}
</style>
