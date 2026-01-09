<script setup lang="ts">
import { parserOptions } from '~/state/parser/options'
import { currentParser } from '~/state/parser/parser'
import { code } from '#imports'

const language = computed(() => {
  if (typeof currentParser.value.editorLanguage === 'string') {
    return currentParser.value.editorLanguage
  }
  return currentParser.value.editorLanguage(parserOptions.value)
})

function showSettings() {
  showEditorSettings.value = true
}
</script>

<template>
  <div relative>
    <div
      p="0.8"
      title="Editor Settings"
      absolute
      right-5
      top-2
      z-100
      nav-button
      cursor-pointer
      text-sm
      @click="showSettings"
    >
      <div i-ri:settings-line />
    </div>
    <CodeEditor v-model="code" :language input h-full w-full />
    <EditorSettings />
  </div>
</template>
