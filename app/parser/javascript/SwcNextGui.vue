<script lang="ts">
import type { ParserOptions } from '@swc-next/core-browser'
const useOption = makeUseOption<ParserOptions>()
</script>

<script setup lang="ts">
const lang = useOption('lang', 'ts', true)
const sourceType = useOption('sourceType', 'module')
const comments = useOption('comments', 'flat')
const preserveParens = useOption('preserveParens', true)
const semanticErrors = useOption('semanticErrors', false)
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
        <option value="flat">flat</option>
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
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
