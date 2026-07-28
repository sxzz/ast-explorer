<script lang="ts">
import type { Options } from './meriyah'

const useOption = makeUseOption<Options>()
</script>

<script setup lang="ts">
const sourceType = useOption('sourceType', 'module', true)
const next = useOption('next', true)
const webcompat = useOption('webcompat')
const ranges = useOption('ranges')
const loc = useOption('loc')
const raw = useOption('raw')
const impliedStrict = useOption('impliedStrict')
const comment = useOption('comment')
const token = useOption('token')
const preserveParens = useOption('preserveParens')
const jsx = useOption('jsx')
const lexical = useOption('lexical')
const validateRegex = useOption('validateRegex', true)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>sourceType</span>
      <select v-model="sourceType" w-full>
        <option value="module">module</option>
        <option value="commonjs">commonjs</option>
        <option value="script">script</option>
      </select>
    </label>
    <label>
      <AppSwitch v-model="next" />
      <span>next</span>
    </label>
    <label>
      <AppSwitch v-model="webcompat" />
      <span>webcompat</span>
    </label>
    <label>
      <AppSwitch v-model="loc" />
      <span>loc</span>
    </label>
    <label>
      <AppSwitch v-model="ranges" />
      <span>ranges</span>
    </label>
    <label>
      <AppSwitch v-model="raw" />
      <span>raw</span>
    </label>
    <label>
      <AppSwitch v-model="impliedStrict" />
      <span>impliedStrict</span>
    </label>
    <label>
      <AppSwitch v-model="comment" />
      <span>comment (onComment)</span>
    </label>
    <label>
      <AppSwitch v-model="token" />
      <span>token (onToken)</span>
    </label>
    <label>
      <AppSwitch v-model="preserveParens" />
      <span>preserveParens</span>
    </label>
    <label>
      <AppSwitch v-model="jsx" />
      <span>JSX</span>
    </label>
    <label>
      <AppSwitch v-model="lexical" />
      <span>lexical</span>
    </label>
    <label>
      <AppSwitch v-model="validateRegex" />
      <span>validateRegex</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
