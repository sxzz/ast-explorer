<script lang="ts">
import type { Options } from 'espree'
const useOptions = makeUseOption<Options>()
</script>

<script setup lang="ts">
defineProps<{
  typescript?: boolean
}>()

const sourceType = useOptions('sourceType', 'script', true)

const range = useOptions('range')
const loc = useOptions('loc')
const comment = useOptions('comment')
const tokens = useOptions('tokens')
const ecmaVersion = useOptions('ecmaVersion', 'latest')
const allowReserved = useOptions('allowReserved')
const jsx = useOptions(['ecmaFeatures', 'jsx'])
const globalReturn = useOptions(['ecmaFeatures', 'globalReturn'])
const impliedStrict = useOptions(['ecmaFeatures', 'impliedStrict'])
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label v-if="!typescript">
      <span>sourceType</span>
      <select v-model="sourceType" w-full>
        <option value="script">script</option>
        <option value="module">module</option>
        <option value="commonjs">commonjs</option>
      </select>
    </label>

    <label>
      <span>ecmaVersion</span>
      <input v-model="ecmaVersion" w-full />
    </label>

    <label>
      <AppSwitch v-model="jsx" />
      <span>JSX</span>
    </label>

    <label v-if="!typescript">
      <AppSwitch v-model="range" />
      <span>range</span>
    </label>

    <label v-if="!typescript">
      <AppSwitch v-model="loc" />
      <span>loc</span>
    </label>

    <label v-if="!typescript">
      <AppSwitch v-model="comment" />
      <span>comment</span>
    </label>

    <label v-if="!typescript">
      <AppSwitch v-model="tokens" />
      <span>tokens</span>
    </label>

    <label v-if="!typescript">
      <AppSwitch v-model="allowReserved" />
      <span>allowReserved</span>
    </label>

    <label>
      <AppSwitch v-model="globalReturn" />
      <span>globalReturn</span>
    </label>

    <label>
      <AppSwitch v-model="impliedStrict" />
      <span>impliedStrict</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
