<script setup lang="ts">
import AppSwitch from '~/components/AppSwitch.vue'
import { makeUseOption } from '~/composables/options'
import type { ParseApiOptions } from '@swc-next/core-browser'

const useOption = makeUseOption<ParseApiOptions>()

const lang = useOption('lang', 'ts', true)
const sourceType = useOption('sourceType', 'module')
const comments = useOption('comments', 'all')
const preserveParens = useOption('preserveParens', true)
const semanticErrors = useOption('semanticErrors', false)
const errorRecovery = useOption('errorRecovery', false)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>lang</span>
      <select v-model="lang" w-full>
        <option value="js">js</option>
        <option value="jsx">jsx</option>
        <option value="ts">ts</option>
        <option value="tsx">tsx</option>
        <option value="dts">dts</option>
      </select>
    </label>

    <label>
      <span>sourceType</span>
      <select v-model="sourceType" w-full>
        <option value="module">module</option>
        <option value="script">script</option>
        <option value="commonjs">commonjs</option>
        <option value="unambiguous">unambiguous</option>
      </select>
    </label>

    <label>
      <span>comments</span>
      <select v-model="comments" w-full>
        <option value="all">all</option>
        <option value="none">none</option>
      </select>
    </label>

    <label>
      <AppSwitch v-model="preserveParens" />
      <span>preserveParens</span>
    </label>

    <label>
      <AppSwitch v-model="semanticErrors" />
      <span>semanticErrors</span>
    </label>

    <label>
      <AppSwitch v-model="errorRecovery" />
      <span>errorRecovery</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
