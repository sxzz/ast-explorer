<script setup lang="ts">
import { parserModules } from '~/state/parser/module'
import { injectProps } from '~/types'
import type { Range } from '~/composables/location'

const props = defineProps<{
  id?: string | number
  value?: any
  root?: boolean
  open?: boolean
}>()
const { currentParser, index } = inject(injectProps)!
const parserModule = computed(() => parserModules.value[index])
const show = computed(() => !shouldHideKey(index, props.id, true, props.value))

const title = computed(() => {
  const { nodeTitle = 'type' } = currentParser.value
  if (typeof nodeTitle === 'function')
    return nodeTitle.call(parserModule.value, props.value)
  const title = props.value?.[nodeTitle]
  if (typeof title === 'string') return title
})
const titleColor = useHighlightColor(() => `${title.value}()`)

const openable = computed(
  () =>
    typeof props.value === 'object' &&
    props.value != null &&
    Object.keys(props.value).length > 0,
)

function isArrayLike(n: unknown) {
  return typeof n == 'object' && n && (Array.isArray(n) || Symbol.iterator in n)
}

const isFocusing = computed(() => {
  // children of csstree is iterable but not array
  if (isArrayLike(props.value)) {
    return Array.from(props.value).some((v) => checkRange(getRange(v, index)))
  }
  return checkRange(getRange(props.value, index))
})
function checkRange(range?: Range) {
  if (!range) return false
  return range[0] <= editorCursor.value && range[1] > editorCursor.value
}

const openManual = ref<boolean>()
const open = computed(
  () =>
    openable.value &&
    (openManual.value ?? (props.open || (autoFocus.value && isFocusing.value))),
)

const valueCreated = ref(false)
watch(open, () => (valueCreated.value ||= open.value), { immediate: true })

function toggleOpen() {
  if (!openable.value) return

  if (
    openManual.value !== undefined &&
    openManual.value !== (props.open || isFocusing.value)
  ) {
    openManual.value = undefined
  } else {
    openManual.value = !open.value
  }
}

const key = computed(() => (props.id != null ? String(props.id) : undefined))
const keyColor = useHighlightColor(key)
const keyClass = computed(
  () => openable.value && 'cursor-pointer hover:underline whitespace-pre',
)

function handleMouseOver(event: MouseEvent) {
  if (props.root) {
    event.stopPropagation()
    outputHoverRange.value = undefined
  } else if (props.value) {
    const range = getRange(props.value, index)
    if (!range) return

    event.stopPropagation()
    outputHoverRange.value = range
  }
}

function handleMouseLeave() {
  if (props.root) {
    outputHoverRange.value = undefined
  }
}

const container = ref<HTMLDivElement>()
const exactFocusing = ref(false)

function handleSubFocusingChange(subFocusing: boolean) {
  exactFocusing.value = isFocusing.value && !subFocusing
}

watch(
  [autoFocus, exactFocusing, isFocusing, container],
  ([autoFocus, exactFocusing, isFocusing, container]) => {
    if (autoFocus && exactFocusing && isFocusing && container) {
      requestAnimationFrame(() => container.scrollIntoView({ block: 'center' }))
    }
  },
  { immediate: true },
)

defineExpose({ isFocusing })
</script>

<template>
  <div
    v-if="show"
    ref="container"
    relative
    w-fit
    :class="isFocusing && exactFocusing && 'ast-highlight'"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <span
      v-if="openable"
      left="-3.5"
      :text="open ? 'red-400' : 'green-400'"
      absolute
      select-none
      font-semibold
      op70
      >{{ open ? '-' : '+' }}</span
    >
    <span v-if="key">
      <span
        :class="keyClass"
        :style="{ color: keyColor }"
        @click="toggleOpen"
        v-text="key"
      />
      <span op70>:&nbsp;</span>
    </span>
    <span v-if="title">
      <span
        :class="keyClass"
        :style="{ color: titleColor }"
        @click="toggleOpen"
        v-text="title"
      />&nbsp;</span
    >
    <span v-if="!openable || valueCreated" v-show="!openable || open">
      <AstValue :id :data="value" @update:focus="handleSubFocusingChange" />
    </span>
    <AstSummaryValue
      v-if="openable && !open"
      :data="value"
      @toggle="toggleOpen"
    />
  </div>
</template>
