<script lang="ts">
import type { Options } from './hermes'

const useOption = makeUseOption<Options>()
</script>

<script setup lang="ts">
const all_comments = useOption('all_comments')
const comments = useOption('comments')
const enums = useOption('enums')
const esproposal_decorators = useOption('esproposal_decorators')
const esproposal_export_star_as = useOption('esproposal_export_star_as')
const tokens = useOption('tokens')
const types = useOption('types')
const use_strict = useOption('use_strict')
const components = useOption('components')
const pattern_matching = useOption('pattern_matching')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <input v-model="all_comments" type="checkbox" switch />
      <span>all_comments</span>
    </label>
    <label>
      <input v-model="comments" type="checkbox" switch />
      <span>comments</span>
    </label>
    <label>
      <input v-model="enums" type="checkbox" switch />
      <span>enums</span>
    </label>
    <label>
      <input v-model="esproposal_decorators" type="checkbox" switch />
      <span>esproposal_decorators</span>
    </label>
    <label>
      <input v-model="esproposal_export_star_as" type="checkbox" switch />
      <span>esproposal_export_star_as</span>
    </label>
    <label>
      <input v-model="tokens" type="checkbox" switch />
      <span>tokens</span>
    </label>
    <label>
      <input v-model="types" type="checkbox" switch />
      <span>types</span>
    </label>
    <label>
      <input v-model="use_strict" type="checkbox" switch />
      <span>use_strict</span>
    </label>
    <label>
      <input v-model="components" type="checkbox" switch />
      <span>components</span>
    </label>
    <label>
      <input v-model="pattern_matching" type="checkbox" switch />
      <span>pattern_matching</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
