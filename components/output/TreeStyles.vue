<script setup lang="ts">
import { showAstTreeStyles } from '#imports'
import json5 from 'json5'

const raw = ref(JSON.stringify(astTreeStyles.value, null, 2))

watchEffect(() => {
  let parsed: EditorSettings
  try {
    parsed = json5.parse(raw.value)
  } catch {
    return
  }
  astTreeStyles.value = parsed
})
</script>

<template>
  <AppDialog
    v-model="showAstTreeStyles"
    h-100
    w-200
    title="AST Tree Styles"
    docs="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#index"
  >
    <CodeEditor v-model="raw" language="json" min-h-0 w-full flex-1 />
  </AppDialog>
</template>
