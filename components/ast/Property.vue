<script setup lang="ts">
const props = defineProps<{
  id?: string | number
  value?: any
}>()
const open = defineModel<boolean>('open', { required: false })

const show = computed(() => !shouldHideKey(props.id, props.value))

const title = computed(() => {
  const {
    module,
    getAstTitle: getter,
    astTitleField: field = 'type',
  } = parserContext.value
  if (getter) return getter.call(module, props.value)
  return props.value?.[field]
})
const titleColor = useHighlightColor(() => `${title.value}()`)

const openable = computed(
  () =>
    typeof props.value === 'object' &&
    props.value != null &&
    Object.keys(props.value).length > 0,
)
function toggleOpen() {
  if (openable.value) open.value = !open.value
}

const key = computed(() => (props.id != null ? String(props.id) : undefined))
const keyColor = useHighlightColor(key)
const keyClass = computed(() => ({
  'cursor-pointer hover:underline': openable.value,
}))

function handleMouseOver(event: MouseEvent) {
  if (props.id === undefined) {
    event.stopPropagation()
    hoverLocation.value = undefined
  } else if (props.value?.loc) {
    event.stopPropagation()
    const { start, end } = props.value.loc
    hoverLocation.value = {
      startColumn: start.column,
      endColumn: end.column,
      startLineNumber: start.line,
      endLineNumber: end.line,
    }
  } else if (props.value?.start && props.value?.end) {
    event.stopPropagation()
    const { start, end } = props.value
    const startColumn = start - code.value.slice(0, start).lastIndexOf('\n')
    const endColumn = end - code.value.slice(0, end).lastIndexOf('\n') - 1

    const startLine = code.value.slice(0, start).split('\n').length
    const endLine = code.value.slice(0, end).split('\n').length

    hoverLocation.value = {
      startColumn,
      endColumn,
      startLineNumber: startLine,
      endLineNumber: endLine,
    }
  }
}

function handleMouseLeave() {
  if (props.id === undefined) {
    hoverLocation.value = undefined
  }
}

defineExpose({
  toggleOpen,
})
</script>

<template>
  <div
    v-if="show"
    relative
    @mouseleave="handleMouseLeave"
    @mouseover="handleMouseOver"
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
    <AstValue v-if="!openable || open" :data="value" />
    <AstSummaryValue v-else :data="value" @toggle="toggleOpen" />
  </div>
</template>
