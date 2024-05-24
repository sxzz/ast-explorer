<script setup lang="ts">
import { code } from '#imports'

const language = computed(() => {
  if (typeof currentParser.value.editorLanguage === 'string') {
    return currentParser.value.editorLanguage
  }
  return currentParser.value.editorLanguage(parserOptions.value)
})
</script>

<template>
  <div>
    <CodeEditor v-model="code" :language input h-full w-full />
  </div>
</template>
