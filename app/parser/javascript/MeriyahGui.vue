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
const globalReturn = useOption('globalReturn')
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
      <input v-model="next" type="checkbox" switch />
      <span>next</span>
    </label>
    <label>
      <input v-model="webcompat" type="checkbox" switch />
      <span>webcompat</span>
    </label>
    <label>
      <input v-model="loc" type="checkbox" switch />
      <span>loc</span>
    </label>
    <label>
      <input v-model="ranges" type="checkbox" switch />
      <span>ranges</span>
    </label>
    <label>
      <input v-model="raw" type="checkbox" switch />
      <span>raw</span>
    </label>
    <label>
      <input v-model="globalReturn" type="checkbox" switch />
      <span>globalReturn</span>
    </label>
    <label>
      <input v-model="impliedStrict" type="checkbox" switch />
      <span>impliedStrict</span>
    </label>
    <label>
      <input v-model="comment" type="checkbox" switch />
      <span>comment (onComment)</span>
    </label>
    <label>
      <input v-model="token" type="checkbox" switch />
      <span>token (onToken)</span>
    </label>
    <label>
      <input v-model="preserveParens" type="checkbox" switch />
      <span>preserveParens</span>
    </label>
    <label>
      <input v-model="jsx" type="checkbox" switch />
      <span>JSX</span>
    </label>
    <label>
      <input v-model="lexical" type="checkbox" switch />
      <span>lexical</span>
    </label>
    <label>
      <input v-model="validateRegex" type="checkbox" switch />
      <span>validateRegex</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
