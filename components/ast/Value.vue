<script setup lang="ts">
import type { AstProperty } from '#components'
const props = defineProps<{ data: any }>()
const emit = defineEmits<{
  'update:hover': [value: boolean]
}>()

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

const properties = useTemplateRefsList<InstanceType<typeof AstProperty>>()
watchEffect(() => {
  const hovering = properties.value.some((p) => p.isHovering)
  emit('update:hover', hovering)
})
</script>

<template>
  <template v-if="typeof data === 'object' && data != null">
    <AstBrackets :data>
      <div v-if="hasChildren" ml6>
        <template v-for="(item, key) of data" :key="key">
          <AstProperty :id="key" :ref="properties.set" :value="item" />
        </template>
      </div>
    </AstBrackets>
  </template>
  <span v-else>
    <span :style="{ color: valueColor }" whitespace-pre v-text="value" />
    <span op70>,</span>
  </span>
</template>
