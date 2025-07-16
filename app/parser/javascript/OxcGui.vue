<script lang="ts">
import type { ParserOptions } from './oxc'
const useOption = makeUseOption<ParserOptions>()
</script>

<script setup lang="ts">
const sourceType = useOption('sourceType', 'script', true)
const sourceFilename = useOption('sourceFilename', '', true)
const preserveParens = useOption('preserveParens', true, true)
const range = useOption('range', false, true)
const showSemanticErrors = useOption('showSemanticErrors', false, true)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>sourceType</span>
      <select v-model="sourceType" w-full>
        <option value="script">script</option>
        <option value="module">module</option>
      </select>
    </label>

    <label>
      <span>sourceFilename</span>
      <input v-model="sourceFilename" w-full />
    </label>

    <label>
      <input v-model="preserveParens" type="checkbox" switch />
      <span>preserveParens</span>
    </label>

    <label>
      <input v-model="range" type="checkbox" switch />
      <span>range</span>
    </label>

    <label>
      <input v-model="showSemanticErrors" type="checkbox" switch />
      <span>showSemanticErrors</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
