<script setup lang="ts">
import {
  autoFocus,
  hideEmptyKeys,
  hideLocationData,
  outputView,
} from '#imports'
import ansiRegex from 'ansi-regex'
import { ast, errors, loading, parseCost } from '~/state/parser/module'
import { currentParserIds, currentParsers, displayVersions, overrideVersion, isUrlVersion } from '~/state/parser/parser';
import { injectProps } from '~/types';

const props = defineProps<{
  index: number
}>()
const currentParser = computed(() => currentParsers.value[props.index]!)
const currentParserId = computed(() => currentParserIds.value[props.index]!)

provide(injectProps, {
  index: props.index,
  currentParser,
  currentParserId
})

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
  'border rounded-full w-7 h-7 items-center flex justify-center hover:bg-gray hover:bg-opacity-20 hover:border-white/20'
const tabSelectedClass = 'bg-$c-text-base! text-$c-bg-base'

const error = computed(() => errors.value && errors.value[props.index])

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

const displayVersion = computed(() => displayVersions.value[props.index])

const disableOverrideVersion = computed(
  () => currentParser.value.versionOverridable === false,
)

function editVersion() {
  // eslint-disable-next-line no-alert
  const newVersion = prompt(
    'Enter a semver version, tag or URL (e.g. 1.0.0, ^1.2.3, next, https://example.com):',
    displayVersion.value,
  )
  overrideVersion.value = newVersion || undefined
}
</script>

<template>
  <div flex="~ col" gap1>
    <div flex="~ y-center wrap" class="output-form" gap2 text-sm>
      <ParserSelect :index="index"></ParserSelect>
      <a text-sm font-mono op80 hover:underline :href="isUrlVersion
        ? overrideVersion
        : `https://www.npmjs.com/package/${currentParser.pkgName}`
        " target="_blank">
        <span>{{ currentParser.pkgName }}</span>
        <template v-if="displayVersion">
          <span>@</span>
          <span :class="[
            isUrlVersion && 'text-blue',
            overrideVersion &&
            !isUrlVersion &&
            'text-green-700 dark:text-green',
            'max-w50 inline-block truncate align-middle',
          ]">{{ displayVersion }}</span>
          <small v-if="overrideVersion && overrideVersion !== displayVersion" op50>
            ({{ overrideVersion }})
          </small>
        </template>
      </a>
      <button :disabled="disableOverrideVersion" :class="disableOverrideVersion && 'cursor-not-allowed op30'"
        title="Change Version" nav-button @click="editVersion">
        <div i-ri:edit-line />
      </button>
      <div flex="~ center" gap3>
        <span op70>{{ +parseCost[index]!.toFixed(1) }} ms</span>
      </div>
      <a v-if="currentParser.link" title="Open Documentation" :href="currentParser.link" target="_blank" flex="~ center"
        nav-button>
        <div i-ri:book-2-line />
      </a>
      <div flex gap1>
        <button :class="[tabClass, outputView === 'tree' && tabSelectedClass]" @click="toggleView('tree')">
          <div i-ri:node-tree />
        </button>
        <button :class="[tabClass, outputView === 'json' && tabSelectedClass]" @click="toggleView('json')">
          <div i-ri:braces-line />
        </button>
      </div>
      <label>
        <input :checked="autoFocus" type="checkbox" switch @click="toggleAutoFocus" />
        Auto focus
      </label>
      <label>
        <input v-model="hideEmptyKeys" type="checkbox" switch /> Hide empty keys
      </label>
      <label>
        <input :checked="hideLocationData" type="checkbox" switch @click="toggleHideLocationData" />
        Hide location data
      </label>
    </div>
    <div flex="~ 1" min-h-0 min-w-0>
      <Loading v-if="loading">
        {{ loading === 'module' ? 'Loading parser' : 'Parsing' }}
      </Loading>
      <div v-else-if="error" overflow-x-auto overflow-y-auto p1 text-sm text-red>
        <span v-text="errorString" whitespace-pre/>
      </div>
      <div v-show="!loading && !error" h-full min-w-0 w-full flex>
        <OutputJson v-if="outputView === 'json'" h-full min-w-0 w-full max-sm:min-h-50vh />
        <OutputTree v-else />
      </div>
    </div>
    <div flex justify-end gap2 px2 pb1 text-sm>
      <button flex="~ y-center" gap1 border rounded px1 py0.5 hover="bg-gray bg-opacity-20 border-white/20"
        @click="print">
        <div i-ri:printer-line />
        Print in Console
      </button>

      <label>
        Hide keys:
        <input v-model="hideKeysValue" type="input" placeholder="field1, field2, ..." />
      </label>
    </div>
  </div>
</template>

<style scoped>
.output-form label {
  --at-apply: 'flex flex-y-center gap1';
}
</style>
