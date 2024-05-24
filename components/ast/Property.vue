<script setup lang="ts">
const props = defineProps<{
  id?: string | number
  value?: any
  root?: boolean
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
  if (props.root) {
    event.stopPropagation()
    outputHoverRange.value = undefined
  } else if (props.value) {
    const range = currentParser.value.getAstLocation?.(props.value)
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

defineExpose({
  toggleOpen,
})
</script>

<template>
  <div
    v-if="show"
    relative
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
    <AstValue v-if="!openable || open" :data="value" />
    <AstSummaryValue v-else :data="value" @toggle="toggleOpen" />
  </div>
</template>
