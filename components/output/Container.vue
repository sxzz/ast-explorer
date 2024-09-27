<script setup lang="ts">
import ansiRegex from 'ansi-regex'
import {
  autoFocus,
  hideEmptyKeys,
  hideLocationData,
  outputView,
} from '#imports'

const hideKeysValue = ref(hideKeys.value.join(', '))
watchEffect(() => {
  try {
    hideKeys.value = hideKeysValue.value.split(',').map((v) => v.trim())
  } catch (error) {
    console.error(error)
    hideKeys.value = []
  }
})

const tabClass = 'w-20 border rounded p1 hover:bg-gray hover:bg-opacity-20 hover:border-white/20'
const tabSelectedClass = 'bg-$c-text-base! text-$c-bg-base'

const errorString = computed(() => {
  if (!error.value) return ''
  const str = String(error.value).replace(ansiRegex(), '')
  let stack: string | undefined
  if (error.value instanceof Error) {
    stack = error.value.stack
    if (isSafari)
      stack = stack
        ?.split('\n')
        .map((line) => {
          const [fn, file] = line.split('@', 2)
          return `${' '.repeat(4)}at ${fn} (${file})`
        })
        .join('\n')
  }
  return `${str}${stack ? `${stack}\n` : ''}`
})

function toggleView(view: 'tree' | 'json') {
  outputView.value = view
}

function print() {
  // eslint-disable-next-line no-console
  console.info(ast.value)
}

function toggleAutoFocus() {
  autoFocus.value = !autoFocus.value
  if (
    outputView.value === 'json' &&
    hideLocationData.value &&
    autoFocus.value
  ) {
    hideLocationData.value = false
  }
}

function toggleHideLocationData() {
  hideLocationData.value = !hideLocationData.value
  if (
    outputView.value === 'json' &&
    autoFocus.value &&
    hideLocationData.value
  ) {
    autoFocus.value = false
  }
}

watch(outputView, (view) => {
  if (view === 'json' && autoFocus.value) {
    hideLocationData.value = false
  }
})
</script>

<template>
  <div flex="~ col" gap2>
    <div flex="~ y-center wrap" class="output-form" gap2 text-sm>
      <div flex gap1>
        <button
          :class="[tabClass, outputView === 'tree' && tabSelectedClass]"
          @click="toggleView('tree')"
        >
          Tree
        </button>
        <button
          :class="[tabClass, outputView === 'json' && tabSelectedClass]"
          @click="toggleView('json')"
        >
          JSON
        </button>
      </div>
      <label>
        <input
          :checked="autoFocus"
          type="checkbox"
          switch
          @click="toggleAutoFocus"
        />
        Auto focus
      </label>
      <label>
        <input v-model="hideEmptyKeys" type="checkbox" switch /> Hide empty keys
      </label>
      <label>
        <input
          :checked="hideLocationData"
          type="checkbox"
          switch
          @click="toggleHideLocationData"
        />
        Hide location data
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
        hover="bg-gray bg-opacity-20 border-white/20"
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
        <pre v-text="errorString" />
      </div>
      <div v-show="!loading && !error" h-full min-w-0 w-full flex>
        <OutputJson
          v-if="outputView === 'json'"
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
