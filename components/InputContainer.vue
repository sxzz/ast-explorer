<script setup lang="ts">
import { code } from '#imports'
import { parsersOptions } from '~/state/parser/options'
import { currentParsers } from '~/state/parser/parser'
import { activeTab } from '~/state/ui.js'

const language = computed(() => {
  const currentParser = currentParsers.value.find(
    (parser) => parser.id === activeTab.value,
  )!

  if (typeof currentParser.editorLanguage === 'string') {
    return currentParser.editorLanguage
  }
  return currentParser.editorLanguage(parsersOptions.value[currentParser.id])
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
      <div i-ri:list-settings-fill />
    </div>
    <CodeEditor v-model="code" :language input h-full w-full />
    <EditorSettings />
  </div>
</template>
