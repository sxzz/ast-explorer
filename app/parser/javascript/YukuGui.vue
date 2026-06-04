<script lang="ts">
import type { Options } from './yuku'
const useOption = makeUseOption<Options>()
</script>

<script setup lang="ts">
const lang = useOption('lang', 'js', true)
const sourceType = useOption('sourceType', 'module', true)
const preserveParens = useOption('preserveParens', true, true)
const allowReturnOutsideFunction = useOption(
  'allowReturnOutsideFunction',
  false,
  true,
)
const semanticErrors = useOption('semanticErrors', false, true)
const attachComments = useOption('attachComments', false, true)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>lang</span>
      <select v-model="lang" w-full>
        <option value="js">js</option>
        <option value="ts">ts</option>
        <option value="jsx">jsx</option>
        <option value="tsx">tsx</option>
        <option value="dts">dts</option>
      </select>
    </label>

    <label>
      <span>sourceType</span>
      <select v-model="sourceType" w-full>
        <option value="module">module</option>
        <option value="script">script</option>
      </select>
    </label>

    <label>
      <input v-model="preserveParens" type="checkbox" switch />
      <span>preserveParens</span>
    </label>

    <label>
      <input v-model="allowReturnOutsideFunction" type="checkbox" switch />
      <span>allowReturnOutsideFunction</span>
    </label>

    <label>
      <input v-model="semanticErrors" type="checkbox" switch />
      <span>semanticErrors</span>
    </label>

    <label>
      <input v-model="attachComments" type="checkbox" switch />
      <span>attachComments</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
