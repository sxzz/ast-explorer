<script setup lang="ts">
import { code } from '#imports'
import { parsersOptions } from '~/state/parser/options'
import { currentParsers } from '~/state/parser/parser'
import { allEqual } from '~/utils'

const language = computed(() => {
  const editorLanguages = currentParsers.value.map(parser => {
    if (typeof parser.editorLanguage === 'string') {
      return parser.editorLanguage
    }
    return parser.editorLanguage(parsersOptions.value[parser.id])
  })

  const isSameLang = allEqual(editorLanguages)
  if(isSameLang) return editorLanguages[0]
  
  return editorLanguages[0]
})

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
