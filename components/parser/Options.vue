<script setup lang="ts">
import { rawOptions } from '~/state/parser/options'
import { currentParser } from '~/state/parser/parser'

defineOptions({ inheritAttrs: false })

const open = ref(false)
</script>

<template>
  <button v-bind="$attrs" @click="open = true">
    <div i-ri:settings-line />
  </button>

  <AppDialog v-model="open" h-80vh title="Parser Options">
    <CodeEditor
      v-model="rawOptions"
      min-h-0
      w-60vw
      flex-1
      :language="currentParser.options.editorLanguage"
    />
  </AppDialog>
</template>
