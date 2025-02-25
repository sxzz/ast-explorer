<script lang="ts">
import type * as Momoa from '@humanwhocodes/momoa'

const useOption = makeUseOption<Momoa.ParseOptions>()
</script>

<script setup lang="ts">
const mode = useOption('mode', 'json', true)
const ranges = useOption('ranges')
const tokens = useOption('tokens')
const allowTrailingCommas = useOption('allowTrailingCommas')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>mode</span>
      <select v-model="mode" w-full>
        <option value="json">json</option>
        <option value="jsonc">jsonc</option>
        <option value="json5">json5</option>
      </select>
    </label>

    <label>
      <input v-model="ranges" type="checkbox" switch />
      <span>ranges</span>
    </label>

    <label>
      <input v-model="tokens" type="checkbox" switch />
      <span>tokens</span>
    </label>

    <label>
      <input v-model="allowTrailingCommas" type="checkbox" switch />
      <span>allowTrailingCommas</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
