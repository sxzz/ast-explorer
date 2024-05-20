<script lang="ts">
import type { ParserOptions } from '@oxc-parser/wasm'
const useOption = makeUseOption<ParserOptions>()
</script>

<script setup lang="ts">
const sourceType = useOption('sourceType', 'script', true)
const sourceFilename = useOption('sourceFilename', '', true)
</script>

<template>
  <div flex="~ col gap4" text-sm font-mono>
    <label flex="~ col gap1">
      <span>source type</span>
      <select v-model="sourceType">
        <option value="script">script</option>
        <option value="module">module</option>
      </select>
    </label>

    <label flex="~ col gap1">
      <span>source filename</span>
      <input v-model="sourceFilename" />
    </label>
  </div>
</template>

<style scoped>
label span {
  --at-apply: 'op85';
}
</style>
