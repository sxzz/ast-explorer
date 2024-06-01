<script lang="ts">
export interface EspreeOptions {
  range?: boolean
  loc?: boolean
  comment?: boolean
  tokens?: boolean
  ecmaVersion?: 'latest' | number
  allowReserved?: boolean
  sourceType?: 'script' | 'module' | 'commonjs'
  ecmaFeatures?: {
    jsx?: boolean
    globalReturn?: boolean
    impliedStrict?: boolean
  }
}
const useOptions = makeUseOption<EspreeOptions>()
</script>

<script setup lang="ts">
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
  <div flex="~ col" gap4 text-sm font-mono>
    <label>
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
      <input v-model="jsx" type="checkbox" switch />
      <span>JSX</span>
    </label>

    <label>
      <input v-model="range" type="checkbox" switch />
      <span>range</span>
    </label>

    <label>
      <input v-model="loc" type="checkbox" switch />
      <span>loc</span>
    </label>

    <label>
      <input v-model="comment" type="checkbox" switch />
      <span>comment</span>
    </label>

    <label>
      <input v-model="tokens" type="checkbox" switch />
      <span>tokens</span>
    </label>

    <label>
      <input v-model="allowReserved" type="checkbox" switch />
      <span>allowReserved</span>
    </label>

    <label>
      <input v-model="globalReturn" type="checkbox" switch />
      <span>globalReturn</span>
    </label>

    <label>
      <input v-model="impliedStrict" type="checkbox" switch />
      <span>impliedStrict</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
