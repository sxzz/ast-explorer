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
      <AppSwitch v-model="html" />
      <span>html</span>
    </label>

    <label>
      <AppSwitch v-model="autoUnwrap" />
      <span>autoUnwrap</span>
    </label>

    <label>
      <AppSwitch v-model="autoClose" />
      <span>autoClose</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
