<script setup lang="ts">
import { computed } from 'vue'
import AppTooltip from '~/components/AppTooltip.vue'
import CodeEditor from '~/components/CodeEditor.vue'
import EditorSettings from '~/components/EditorSettings.vue'
import { code, showEditorSettings } from '~/state/editor'
import { parserOptions } from '~/state/parser/options'
import { currentParser } from '~/state/parser/parser'

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
    <AppTooltip text="Editor Settings">
      <button
        aria-label="Editor Settings"
        p="0.8"
        absolute
        right-5
        top-2
        z-100
        nav-button
        text-sm
        @click="showSettings"
      >
        <div i-ri:settings-line />
      </button>
    </AppTooltip>
    <CodeEditor v-model="code" :language input h-full w-full />
    <EditorSettings />
  </div>
</template>
