<script setup lang="ts">
import { rawOptions } from '~/state/parser/options'
import { currentParsers } from '~/state/parser/parser.js'
defineOptions({ inheritAttrs: false })
defineProps<{
  parserId: string
  index: number
}>()

const open = ref(false)
</script>

<template>
  <button v-bind="$attrs" @click="open = true">
    <div i-ri:settings-line />
  </button>

  <AppDialog v-model="open" h-80vh title="Parser Options">
    <CodeEditor v-model="rawOptions[parserId]" min-h-0 w-60vw flex-1
      :language="currentParsers[index]!.options.editorLanguage" />
  </AppDialog>
</template>
