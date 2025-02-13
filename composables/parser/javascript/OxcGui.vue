<script lang="ts">
import type { ParserOptions } from '@oxc-parser/wasm'
const useOption = makeUseOption<ParserOptions>()
</script>

<script setup lang="ts">
const sourceType = useOption('sourceType', 'script', true)
const sourceFilename = useOption('sourceFilename', '', true)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label flex="~ col" gap1>
      <span>sourceType</span>
      <select v-model="sourceType">
        <option value="script">script</option>
        <option value="module">module</option>
      </select>
    </label>

    <label flex="~ col" gap1>
      <span>sourceFilename</span>
      <input v-model="sourceFilename" />
    </label>
  </div>
</template>
