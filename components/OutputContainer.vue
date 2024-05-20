<script setup lang="ts">
import { autoFocus, hideEmptyKeys, hideLocationData } from '#imports'

const hideKeysValue = ref(hideKeys.value.join(', '))
watchEffect(() => {
  try {
    hideKeys.value = hideKeysValue.value.split(',').map((v) => v.trim())
  } catch (error) {
    console.error(error)
    hideKeys.value = []
  }
})

const currentView = ref<'tree' | 'json'>('tree')
const tabClass = 'w-20 border rounded p1'
const tabSelectedClass = 'bg-$c-text-base text-$c-bg-base'

function stringifyError(error: unknown) {
  if (error instanceof Error) {
    if (isSafari)
      return `${error}\n${error.stack
        ?.split('\n')
        .map((line) => {
          const [fn, file] = line.split('@', 2)
          return `${' '.repeat(4)}at ${fn} (${file})`
        })
        .join('\n')}`
    return error.stack
  }
  return String(error)
}

function print() {
  // eslint-disable-next-line no-console
  console.info(ast.value)
}
</script>

<template>
  <div flex="~ col" gap2>
    <div flex="~ y-center wrap" class="output-form" gap2 text-sm>
      <div flex gap1>
        <button
          :class="[tabClass, currentView === 'tree' && tabSelectedClass]"
          @click="currentView = 'tree'"
        >
          Tree
        </button>
        <button
          :class="[tabClass, currentView === 'json' && tabSelectedClass]"
          @click="currentView = 'json'"
        >
          JSON
        </button>
      </div>
      <label>
        <input v-model="autoFocus" type="checkbox" switch /> Auto focus
      </label>
      <label>
        <input v-model="hideEmptyKeys" type="checkbox" switch /> Hide empty keys
      </label>
      <label>
        <input v-model="hideLocationData" type="checkbox" switch /> Hide
        location data
      </label>
      <label>
        Hide keys:
        <input
          v-model="hideKeysValue"
          type="input"
          placeholder="field1, field2, ..."
        />
      </label>
      <button
        flex="~ y-center"
        gap1
        border
        rounded
        px1
        py0.5
        text-sm
        hover:border-current
        @click="print"
      >
        <div i-ri:printer-line />
        Print in Console
      </button>
    </div>
    <div flex="~ 1" min-h-0 min-w-0>
      <div v-if="loading === 'load'">Loading parser...</div>
      <div v-else-if="loading === 'parse'">Parsing...</div>
      <div v-else-if="error" overflow-scroll text-sm text-red>
        <pre v-text="stringifyError(error)" />
      </div>
      <div v-show="!loading && !error" h-full min-w-0 w-full flex>
        <OutputJson
          v-if="currentView === 'json'"
          h-full
          min-w-0
          w-full
          max-sm:min-h-50vh
        />
        <OutputTree v-else w-full />
      </div>
    </div>
  </div>
</template>

<style scoped>
.output-form label {
  --at-apply: 'flex flex-y-center gap1';
}
</style>
