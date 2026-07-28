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
      <AppSwitch v-model="types" />
      <span>types</span>
    </label>
    <label>
      <AppSwitch v-model="use_strict" />
      <span>use_strict</span>
    </label>
    <label>
      <AppSwitch v-model="comments" />
      <span>comments</span>
    </label>
    <label>
      <AppSwitch v-model="all_comments" />
      <span>all_comments</span>
    </label>
    <label>
      <AppSwitch v-model="tokens" />
      <span>tokens</span>
    </label>
    <h3 border-t pt1 text-center font-bold>Language features</h3>
    <label>
      <AppSwitch v-model="enums" />
      <span>enums</span>
    </label>
    <label>
      <AppSwitch v-model="match" />
      <span>match</span>
    </label>
    <label>
      <AppSwitch v-model="components" />
      <span>components</span>
    </label>
    <label>
      <AppSwitch v-model="assert_operator" />
      <span>assert_operator</span>
    </label>
    <label>
      <AppSwitch v-model="esproposal_decorators" />
      <span>esproposal_decorators</span>
    </label>
    <label>
      <AppSwitch v-model="pattern_matching" />
      <span>pattern_matching</span>
    </label>
    <label>
      <AppSwitch v-model="records" />
      <span>records</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
