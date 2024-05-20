<script setup lang="ts">
const props = defineProps<{ data: any }>()

const hasChildren = computed(
  () =>
    typeof props.data === 'object' &&
    props.data != null &&
    Object.keys(props.data).length > 0,
)

const value = computed<string | undefined>(() => {
  if (typeof props.data === 'object' && props.data !== null) return
  if (typeof props.data === 'bigint') return String(props.data)
  return props.data == null ? String(props.data) : JSON.stringify(props.data)
})
const valueColor = useHighlightColor(value)
</script>

<template>
  <template v-if="typeof data === 'object' && data != null">
    <AstBrackets :data>
      <div v-if="hasChildren" ml6>
        <template v-for="(item, key) of data" :key="key">
          <AstProperty :id="key" :value="item" />
        </template>
      </div>
    </AstBrackets>
  </template>
  <span v-else>
    <span :style="{ color: valueColor }" v-text="value" />
    <span op70>,</span>
  </span>
</template>
