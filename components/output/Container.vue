<script setup lang="ts">
import {
  autoFocus,
  hideEmptyKeys,
  hideLocationData,
  outputViews,
} from '#imports'
import ansiRegex from 'ansi-regex'
import { ast, errors, loading, parseCost } from '~/state/parser/module'
import {
  currentParserIds,
  currentParsers,
  displayVersions,
  isUrlVersions,
  overrideVersions,
} from '~/state/parser/parser'
import { injectProps } from '~/types'

const props = defineProps<{
  index: number
}>()

const isUrlVersion = computed(() => isUrlVersions.value[props.index])
const currentParser = computed(() => currentParsers.value[props.index]!)
const currentParserId = computed(() => currentParserIds.value[props.index]!)
const currentAutoFocus = computed({
  get() {
    return autoFocus.value[props.index]!
  },
  set(newVal) {
    autoFocus.value[props.index] = newVal
  },
})
const currentHideLocationData = computed({
  get() {
    return hideLocationData.value[props.index]!
  },
  set(newVal) {
    hideLocationData.value[props.index] = newVal
  },
})
const currentHideEmptyKeys = computed({
  get() {
    return hideEmptyKeys.value[props.index]!
  },
  set(newVal) {
    hideEmptyKeys.value[props.index] = newVal
  },
})
const currentOutputView = computed({
  get() {
    return outputViews.value[props.index]!
  },
  set(newVal) {
    outputViews.value[props.index] = newVal
  },
})
const currentHideKeys = computed({
  get() {
    return hideKeys.value[props.index]!
  },
  set(newVal) {
    hideKeys.value[props.index] = newVal
  },
})

provide(injectProps, {
  index: props.index,
  currentParser,
  currentParserId,
  currentAutoFocus,
  currentHideLocationData,
  currentHideEmptyKeys,
  currentHideKeys,
})

const hideKeysValue = ref(currentHideKeys.value.join(', '))
watchEffect(() => {
  try {
    currentHideKeys.value = hideKeysValue.value.split(',').map((v) => v.trim())
  } catch (error) {
    console.error(error)
    currentHideKeys.value = []
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
  currentOutputView.value = view
}

function print() {
  console.info(toRaw(ast.value[props.index]))
}

function toggleAutoFocus() {
  currentAutoFocus.value = !currentAutoFocus.value
  if (
    currentOutputView.value === 'json' &&
    currentHideLocationData.value &&
    currentAutoFocus
  ) {
    currentHideLocationData.value = false
  }
}

function toggleHideLocationData() {
  currentHideLocationData.value = !currentHideLocationData.value
  if (
    currentOutputView.value === 'json' &&
    currentAutoFocus.value &&
    currentHideLocationData.value
  ) {
    currentAutoFocus.value = false
  }
}

function toggleHideEmptyKeys() {
  currentHideEmptyKeys.value = !currentHideEmptyKeys.value
}

watch(currentOutputView, (view) => {
  if (view === 'json' && currentAutoFocus.value) {
    currentHideLocationData.value = false
  }
})

const displayVersion = computed(() => displayVersions.value[props.index])
const overrideVersion = computed(() => overrideVersions.value[props.index])
const disableOverrideVersion = computed(
  () => currentParser.value.versionOverridable === false,
)

function editVersion() {
  // eslint-disable-next-line no-alert
  const newVersion = prompt(
    'Enter a semver version, tag or URL (e.g. 1.0.0, ^1.2.3, next, https://example.com):',
    displayVersion.value,
  )
  overrideVersions.value[props.index] = newVersion || undefined
}
</script>

<template>
  <div flex="~ col" gap1>
    <div flex="~ y-center wrap" class="output-form" gap2 text-sm>
      <ParserSelect :index="index" />
      <a
        text-sm
        font-mono
        op80
        hover:underline
        :href="
          isUrlVersion
            ? overrideVersion
            : `https://www.npmjs.com/package/${currentParser.pkgName}`
        "
        target="_blank"
      >
        <span>{{ currentParser.pkgName }}</span>
        <template v-if="displayVersion">
          <span>@</span>
          <span
            :class="[
              isUrlVersion && 'text-blue',
              overrideVersion &&
                !isUrlVersion &&
                'text-green-700 dark:text-green',
              'max-w50 inline-block truncate align-middle',
            ]"
            >{{ displayVersion }}</span
          >
          <small
            v-if="overrideVersion && overrideVersion !== displayVersion"
            op50
          >
            ({{ overrideVersion }})
          </small>
        </template>
      </a>
      <button
        :disabled="disableOverrideVersion"
        :class="disableOverrideVersion && 'cursor-not-allowed op30'"
        title="Change Version"
        nav-button
        @click="editVersion"
      >
        <div i-ri:edit-line />
      </button>
      <div flex="~ center" gap3>
        <span op70>{{ +parseCost[index]!.toFixed(1) }} ms</span>
      </div>
      <a
        v-if="currentParser.link"
        title="Open Documentation"
        :href="currentParser.link"
        target="_blank"
        flex="~ center"
        nav-button
      >
        <div i-ri:book-2-line />
      </a>
      <div flex gap1>
        <button
          :class="[tabClass, currentOutputView === 'tree' && tabSelectedClass]"
          @click="toggleView('tree')"
        >
          <div i-ri:node-tree />
        </button>
        <button
          :class="[tabClass, currentOutputView === 'json' && tabSelectedClass]"
          @click="toggleView('json')"
        >
          <div i-ri:braces-line />
        </button>
      </div>
      <label>
        <input
          :checked="currentAutoFocus"
          type="checkbox"
          switch
          @click="toggleAutoFocus"
        />
        Auto focus
      </label>
      <label>
        <input
          v-model="currentHideEmptyKeys"
          type="checkbox"
          switch
          @click="toggleHideEmptyKeys"
        />
        Hide empty keys
      </label>
      <label>
        <input
          :checked="currentHideLocationData"
          type="checkbox"
          switch
          @click="toggleHideLocationData"
        />
        Hide location data
      </label>
    </div>
    <div flex="~ 1" min-h-0 min-w-0>
      <Loading v-if="loading">
        {{ loading === 'module' ? 'Loading parser' : 'Parsing' }}
      </Loading>
      <div v-else-if="error" w-full overflow-auto p1 text-sm text-red>
        <span whitespace-pre v-text="errorString" />
      </div>
      <div v-show="!loading && !error" h-full min-w-0 w-full flex>
        <OutputJson
          v-if="currentOutputView === 'json'"
          h-full
          min-w-0
          w-full
          max-sm:min-h-50vh
        />
        <OutputTree v-else />
      </div>
    </div>
    <div flex justify-end gap2 px2 pb1 text-sm>
      <button
        flex="~ y-center"
        gap1
        border
        rounded
        px1
        py0.5
        hover="bg-gray bg-opacity-20 border-white/20"
        @click="print"
      >
        <div i-ri:printer-line />
        Print in Console
      </button>

      <label>
        Hide keys:
        <input
          v-model="hideKeysValue"
          type="input"
          placeholder="field1, field2, ..."
        />
      </label>
    </div>
  </div>
</template>

<style scoped>
.output-form label {
  --at-apply: 'flex flex-y-center gap1';
}
</style>
