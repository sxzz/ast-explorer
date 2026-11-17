<script setup lang="ts">
import AppSwitch from '~/components/AppSwitch.vue'
import { makeUseOption } from '~/composables/options'
import type { ParseOptions } from '@joekav/go-fast'
const useOption = makeUseOption<ParseOptions>()

const resolve = useOption('resolve', false, true)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <AppSwitch v-model="resolve" />
      <span>Resolve scopes</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
