<script lang="ts">
import { makeUseOption } from '~/composables/options'
import type { ParserOptions } from './oxc'
const useOption = makeUseOption<ParserOptions>()
</script>

<script setup lang="ts">
const sourceType = useOption('sourceType', 'script', true)
const filename = useOption('filename', 'foo.ts', true)
const preserveParens = useOption('preserveParens', true, true)
const range = useOption('range', false, true)
const showSemanticErrors = useOption('showSemanticErrors', false, true)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>filename</span>
      <input v-model="filename" w-full />
    </label>

    <label>
      <span>sourceType</span>
      <select v-model="sourceType" w-full>
        <option value="script">script</option>
        <option value="module">module</option>
      </select>
    </label>

    <label>
      <AppSwitch v-model="preserveParens" />
      <span>preserveParens</span>
    </label>

    <label>
      <AppSwitch v-model="range" />
      <span>range</span>
    </label>

    <label>
      <AppSwitch v-model="showSemanticErrors" />
      <span>showSemanticErrors</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
