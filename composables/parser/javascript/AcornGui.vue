<script lang="ts">
import type { Options } from './acorn'

const useOption = makeUseOption<Options>()
</script>

<script setup lang="ts">
const sourceType = useOption('sourceType', 'script', true)
const ecmaVersion = useOption('ecmaVersion')

const allowReserved = useOption('allowReserved')
const allowReturnOutsideFunction = useOption('allowReturnOutsideFunction')
const allowImportExportEverywhere = useOption('allowImportExportEverywhere')
const allowAwaitOutsideFunction = useOption('allowAwaitOutsideFunction')
const allowSuperOutsideMethod = useOption('allowSuperOutsideMethod')
const allowHashBang = useOption('allowHashBang')
const checkPrivateFields = useOption('checkPrivateFields', true)

const locations = useOption('locations')
const ranges = useOption('ranges')
const preserveParens = useOption('preserveParens')
const comments = useOption('comments', false)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>sourceType</span>
      <select v-model="sourceType" w-full>
        <option value="script">script</option>
        <option value="module">module</option>
      </select>
    </label>

    <label>
      <span>ecmaVersion</span>
      <input v-model="ecmaVersion" w-full />
    </label>

    <label>
      <input v-model="allowReserved" type="checkbox" switch />
      <span>allowReserved</span>
    </label>

    <label>
      <input v-model="allowReturnOutsideFunction" type="checkbox" switch />
      <span>allowReturnOutsideFunction</span>
    </label>

    <label>
      <input v-model="allowImportExportEverywhere" type="checkbox" switch />
      <span>allowImportExportEverywhere</span>
    </label>

    <label>
      <input v-model="allowAwaitOutsideFunction" type="checkbox" switch />
      <span>allowAwaitOutsideFunction</span>
    </label>

    <label>
      <input v-model="allowSuperOutsideMethod" type="checkbox" switch />
      <span>allowSuperOutsideMethod</span>
    </label>

    <label>
      <input v-model="allowHashBang" type="checkbox" switch />
      <span>allowHashBang</span>
    </label>

    <label>
      <input v-model="checkPrivateFields" type="checkbox" switch />
      <span>checkPrivateFields</span>
    </label>

    <label>
      <input v-model="locations" type="checkbox" switch />
      <span>locations</span>
    </label>

    <label>
      <input v-model="ranges" type="checkbox" switch />
      <span>ranges</span>
    </label>

    <label>
      <input v-model="preserveParens" type="checkbox" switch />
      <span>preserveParens</span>
    </label>

    <label>
      <input v-model="comments" type="checkbox" switch />
      <span>comments</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
