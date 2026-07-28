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
const comment = useOption('comment', false)
const token = useOption('token', false)
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
      <AppSwitch v-model="allowReserved" />
      <span>allowReserved</span>
    </label>

    <label>
      <AppSwitch v-model="allowReturnOutsideFunction" />
      <span>allowReturnOutsideFunction</span>
    </label>

    <label>
      <AppSwitch v-model="allowImportExportEverywhere" />
      <span>allowImportExportEverywhere</span>
    </label>

    <label>
      <AppSwitch v-model="allowAwaitOutsideFunction" />
      <span>allowAwaitOutsideFunction</span>
    </label>

    <label>
      <AppSwitch v-model="allowSuperOutsideMethod" />
      <span>allowSuperOutsideMethod</span>
    </label>

    <label>
      <AppSwitch v-model="allowHashBang" />
      <span>allowHashBang</span>
    </label>

    <label>
      <AppSwitch v-model="checkPrivateFields" />
      <span>checkPrivateFields</span>
    </label>

    <label>
      <AppSwitch v-model="locations" />
      <span>locations</span>
    </label>

    <label>
      <AppSwitch v-model="ranges" />
      <span>ranges</span>
    </label>

    <label>
      <AppSwitch v-model="preserveParens" />
      <span>preserveParens</span>
    </label>

    <label>
      <AppSwitch v-model="comment" />
      <span>comment (onComment)</span>
    </label>

    <label>
      <AppSwitch v-model="token" />
      <span>token (onToken)</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
