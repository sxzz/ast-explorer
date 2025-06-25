<script setup lang="ts">
import { code } from '#imports'
// import { parserOptions } from '~/state/parser/options'
import { currentParsers } from '~/state/parser/parser'

// const language = computed(() => {
//   if (typeof currentParsers.value[0].editorLanguage === 'string') {
//     return currentParsers.value[0].editorLanguage
//   }
//   return currentParsers.value[0].editorLanguage(parserOptions.value)
// })

function showSettings() {
  showEditorSettings.value = true
}
</script>

<template>
  <div relative>
    <div p="0.8" title="Editor Settings" absolute right-5 top-2 z-100 cursor-pointer text-sm nav-button
      @click="showSettings">
      <div i-ri:list-settings-fill />
    </div>
    <!-- <CodeEditor v-model="code" :language input h-full w-full /> -->
    <CodeEditor v-model="code" input h-full w-full /> -->
    <EditorSettings />
  </div>
</template>
