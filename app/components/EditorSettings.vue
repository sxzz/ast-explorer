<script setup lang="ts">
import json5 from 'json5'
import { showEditorSettings } from '#imports'

const raw = ref(JSON.stringify(editorSettings.value, null, 2))

watchEffect(() => {
  let parsed: EditorSettings
  try {
    parsed = json5.parse(raw.value)
  } catch {
    return
  }
  editorSettings.value = parsed
})
</script>

<template>
  <AppDialog
    v-model="showEditorSettings"
    h-100
    w-200
    title="Editor Settings"
    docs="https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html"
  >
    <CodeEditor v-model="raw" language="json" min-h-0 w-full flex-1 />
  </AppDialog>
</template>
