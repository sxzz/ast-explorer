<script lang="ts">
import type { Options } from './hermes'

const useOption = makeUseOption<Options>()
</script>

<script setup lang="ts">
const sourceType = useOption('sourceType', 'unambiguous')
const allowReturnOutsideFunction = useOption(
  'allowReturnOutsideFunction',
  true,
  true,
)
const flow = useOption('flow', 'detect')
const enableExperimentalComponentSyntax = useOption(
  'enableExperimentalComponentSyntax',
  true,
  true,
)
const enableExperimentalFlowMatchSyntax = useOption(
  'enableExperimentalFlowMatchSyntax',
  true,
  true,
)

const tokens = useOption('tokens')
const babel = useOption('babel')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>sourceType</span>
      <select v-model="sourceType" w-full>
        <option value="unambiguous">unambiguous</option>
        <option value="module">module</option>
        <option value="script">script</option>
      </select>
    </label>

    <label>
      <span>flow</span>
      <select v-model="flow" w-full>
        <option value="all">all</option>
        <option value="detect">detect</option>
      </select>
    </label>

    <label>
      <input v-model="allowReturnOutsideFunction" type="checkbox" switch />
      <span>allowReturnOutsideFunction</span>
    </label>

    <label>
      <input
        v-model="enableExperimentalComponentSyntax"
        type="checkbox"
        switch
      />
      <span>enableExperimentalComponentSyntax</span>
    </label>

    <label>
      <input
        v-model="enableExperimentalFlowMatchSyntax"
        type="checkbox"
        switch
      />
      <span>enableExperimentalFlowMatchSyntax</span>
    </label>

    <label>
      <input v-model="tokens" type="checkbox" switch />
      <span>tokens</span>
    </label>

    <label>
      <input v-model="babel" type="checkbox" switch />
      <span>babel</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
