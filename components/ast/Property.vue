<script setup lang="ts">
const props = defineProps<{
  id?: string | number
  value?: any
}>()
const open = defineModel('open', { default: true })

const show = computed(() => {
  if (hideEmptyKeys.value && props.value == null) {
    return false
  }
  if (
    hideLocationData.value &&
    typeof props.id === 'string' &&
    locationKeyList.includes(props.id)
  ) {
    return false
  }
  return true
})

const title = computed(() => {
  const parser = currentParser.value
  const { getAstTitle: getter, astTitleField: field = 'type' } = parser
  if (getter) return getter.call(parserContext.value, props.value)
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
</script>

<template>
  <div v-if="show" relative>
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
    <AstValue v-if="open" :data="value" />
    <AstSummaryValue v-else :data="value" @toggle="toggleOpen" />
  </div>
</template>
