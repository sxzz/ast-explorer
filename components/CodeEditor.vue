<script setup lang="ts">
import type * as monaco from 'monaco-editor'
import { type MonacoEditor } from '#build/components'
import { type MonacoLanguage } from '~/composables/language'

defineProps<{
  language: MonacoLanguage
}>()
const code = defineModel<string>()

const editorRef = shallowRef<InstanceType<typeof MonacoEditor>>()

const options = computed<monaco.editor.IStandaloneEditorConstructionOptions>(
  () => {
    return {
      automaticLayout: true,
      theme: isDark.value ? 'vs-dark' : 'vs',
      fontSize: 14,
      tabSize: 2,
      minimap: {
        enabled: false,
      },
    }
  }
)
</script>

<template>
  <MonacoEditor
    ref="editorRef"
    v-model="code"
    h-full
    :lang="language"
    :options="options"
  >
    <div flex="~ col gap-2" h-full w-full items-center justify-center>
      <div i-ri:loader-2-line animate-spin text-4xl />
      <span text-lg>Loading...</span>
    </div>
  </MonacoEditor>
</template>
