<script lang="ts">
import type { ComarkOptions } from './index'

const useOption = makeUseOption<ComarkOptions>()
</script>

<script setup lang="ts">
const html = useOption('html')
const autoUnwrap = useOption('autoUnwrap')
const autoClose = useOption('autoClose')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <input v-model="html" type="checkbox" switch />
      <span>html</span>
    </label>

    <label>
      <input v-model="autoUnwrap" type="checkbox" switch />
      <span>autoUnwrap</span>
    </label>

    <label>
      <input v-model="autoClose" type="checkbox" switch />
      <span>autoClose</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
