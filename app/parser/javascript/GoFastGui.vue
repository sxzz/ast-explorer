<script lang="ts">
import type { ParseOptions } from '@joekav/go-fast'
const useOption = makeUseOption<ParseOptions>()
</script>

<script setup lang="ts">
const resolve = useOption('resolve', false, true)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <input v-model="resolve" type="checkbox" switch />
      <span>Resolve scopes</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
