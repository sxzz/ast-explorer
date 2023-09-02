<script setup lang="ts">
import { code } from '#imports'

const language = computed(() => {
  if (typeof currentLanguage.value.language === 'string') {
    return currentLanguage.value.language
  }
  return currentLanguage.value.language(options.value)
})
</script>

<template>
  <main h-screen flex="~ col">
    <NavBar mb-1 />
    <div min-h-0 flex="~ gap3">
      <CodeEditor
        v-model="code"
        :language="language"
        flex-1
        max-w="50%"
        min-w="50%"
      />
      <ASTViewer flex-1 />
    </div>
  </main>
</template>
