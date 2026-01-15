<script lang="ts">
import type { Options } from './flow'

const useOption = makeUseOption<Options>()
</script>

<script setup lang="ts">
const types = useOption('types')
const use_strict = useOption('use_strict')
const comments = useOption('comments')
const all_comments = useOption('all_comments')
const tokens = useOption('tokens')

const enums = useOption('enums')
const match = useOption('match')
const components = useOption('components')
const assert_operator = useOption('assert_operator')
const esproposal_decorators = useOption('esproposal_decorators')
const pattern_matching = useOption('pattern_matching')
const records = useOption('records')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <h3 border-t pt1 text-center font-bold>Basic options</h3>
    <label>
      <input v-model="types" type="checkbox" switch />
      <span>types</span>
    </label>
    <label>
      <input v-model="use_strict" type="checkbox" switch />
      <span>use_strict</span>
    </label>
    <label>
      <input v-model="comments" type="checkbox" switch />
      <span>comments</span>
    </label>
    <label>
      <input v-model="all_comments" type="checkbox" switch />
      <span>all_comments</span>
    </label>
    <label>
      <input v-model="tokens" type="checkbox" switch />
      <span>tokens</span>
    </label>
    <h3 border-t pt1 text-center font-bold>Language features</h3>
    <label>
      <input v-model="enums" type="checkbox" switch />
      <span>enums</span>
    </label>
    <label>
      <input v-model="match" type="checkbox" switch />
      <span>match</span>
    </label>
    <label>
      <input v-model="components" type="checkbox" switch />
      <span>components</span>
    </label>
    <label>
      <input v-model="assert_operator" type="checkbox" switch />
      <span>assert_operator</span>
    </label>
    <label>
      <input v-model="esproposal_decorators" type="checkbox" switch />
      <span>esproposal_decorators</span>
    </label>
    <label>
      <input v-model="pattern_matching" type="checkbox" switch />
      <span>pattern_matching</span>
    </label>
    <label>
      <input v-model="records" type="checkbox" switch />
      <span>records</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
