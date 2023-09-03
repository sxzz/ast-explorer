<script setup lang="ts">
import { code } from '#imports'

const language = computed(() => {
  if (typeof currentParser.value.editorLanguage === 'string') {
    return currentParser.value.editorLanguage
  }
  return currentParser.value.editorLanguage(options.value)
})
</script>

<template>
  <main h-screen flex="~ col">
    <NavBar mb-1 />
    <div min-h-0 flex="~ gap3 1">
      <CodeEditor
        v-model="code"
        :language="language"
        flex-1
        max-w="50%"
        min-w="50%"
      />
      <AstViewer />
    </div>
  </main>
</template>
