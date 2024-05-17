<script setup lang="ts">
import type { MonacoLanguage } from '#imports'
import type * as monaco from 'monaco-editor'
import type { MonacoEditor } from '#build/components'

defineProps<{
  language: MonacoLanguage
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

watchEffect(() => {
  const editor = toRaw(container.value?.$editor)
  if (!editor) return
  editor.onDidChangeCursorPosition((e) => {
    editorCursor.value = editor.getModel()!.getOffsetAt(e.position)
  })
})
</script>

<template>
  <MonacoEditor
    ref="container"
    v-model="code"
    :lang="language"
    :options="options"
  >
    <div flex="~ col gap-2" h-full w-full items-center justify-center>
      <div i-ri:loader-2-line animate-spin text-4xl />
      <span text-lg>Loading...</span>
    </div>
  </MonacoEditor>
</template>
