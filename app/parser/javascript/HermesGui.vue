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
      <AppSwitch v-model="allowReturnOutsideFunction" />
      <span>allowReturnOutsideFunction</span>
    </label>

    <label>
      <AppSwitch v-model="enableExperimentalComponentSyntax" />
      <span text-11px>enableExperimentalComponentSyntax</span>
    </label>

    <label>
      <AppSwitch v-model="enableExperimentalFlowMatchSyntax" />
      <span text-11px>enableExperimentalFlowMatchSyntax</span>
    </label>

    <label>
      <AppSwitch v-model="tokens" />
      <span>tokens</span>
    </label>

    <label>
      <AppSwitch v-model="babel" />
      <span>babel</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
