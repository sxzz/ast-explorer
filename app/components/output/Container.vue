<script setup lang="ts">
import ansiRegex from 'ansi-regex'
import { ast, error, loading } from '~/state/parser/module'
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

const tabClass =
  'flex-center flex w-7.5 h-7 items-center justify-center rounded-md text-soft hover:text-base transition-colors'
const tabSelectedClass = 'bg-$c-bg-base text-base shadow-sm'

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
  return `${str}\n\n${stack && str !== stack ? `${stack}\n` : ''}`
})

function toggleView(view: 'tree' | 'json') {
  outputView.value = view
}

function print() {
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
    <div flex="~ y-center wrap" class="output-form" gap3 px2 text-sm>
      <div flex gap0.5 border border-base rounded-lg bg-sunk p0.5>
        <button
          :class="[tabClass, outputView === 'tree' && tabSelectedClass]"
          title="Tree view"
          @click="toggleView('tree')"
        >
          <div i-ri:node-tree />
        </button>
        <button
          :class="[tabClass, outputView === 'json' && tabSelectedClass]"
          title="JSON view"
          @click="toggleView('json')"
        >
          <div i-ri:braces-line />
        </button>
      </div>
      <span class="h-4 w-px bg-$c-border" />
      <label>
        <input
          :checked="autoFocus"
          type="checkbox"
          switch
          @click="toggleAutoFocus"
        />
        <span>Auto focus</span>
      </label>
      <label>
        <input v-model="hideEmptyKeys" type="checkbox" switch />
        <span>Hide empty keys</span>
      </label>
      <label>
        <input
          :checked="hideLocationData"
          type="checkbox"
          switch
          @click="toggleHideLocationData"
        />
        <span>Hide location data</span>
      </label>
    </div>
    <div flex="~ 1" min-h-0 min-w-0>
      <Loading v-if="loading">
        {{ loading === 'module' ? 'Loading parser' : 'Parsing' }}
      </Loading>
      <div
        v-else-if="error"
        flex
        flex-col
        gap2
        overflow-scroll
        p3
        text-sm
        text-red-600
        dark:text-red-400
      >
        <span
          class="text-[0.6875rem] font-medium tracking-[0.18em] uppercase !text-red-600 dark:!text-red-400"
          >Parser error</span
        >
        <pre class="font-mono" v-text="errorString" />
      </div>
      <div v-show="!loading && !error" h-full min-w-0 w-full flex>
        <OutputJson
          v-if="outputView === 'json'"
          h-full
          min-w-0
          w-full
          max-sm:min-h-50vh
        />
        <OutputTree v-else />
      </div>
    </div>
    <div flex flex-wrap items-center justify-end gap3 px2 pb1 text-sm text-soft>
      <label flex="~ y-center" gap1.5>
        <span
          class="text-[0.6875rem] text-mute font-medium tracking-[0.18em] uppercase"
          >Hide keys</span
        >
        <input
          v-model="hideKeysValue"
          type="input"
          placeholder="field1, field2, …"
          w-44
          text-sm
          class="font-mono"
        />
      </label>
      <button pill-button @click="print">
        <div i-ri:printer-line />
        Print in console
      </button>
    </div>
  </div>
</template>

<style scoped>
.output-form label {
  --at-apply: 'flex flex-y-center gap1.5 cursor-pointer text-soft';
}
.output-form label:has(input:checked) {
  --at-apply: 'text-base';
}
</style>
