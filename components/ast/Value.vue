<script setup lang="ts">
import { parserModule } from '~/state/parser/module'
import { currentParser } from '~/state/parser/parser'
import type { AstProperty } from '#components'

const props = defineProps<{
  id?: string | number
  data: any
}>()
const emit = defineEmits<{
  'update:focus': [value: boolean]
}>()

const hasChildren = computed(
  () =>
    typeof props.data === 'object' &&
    props.data != null &&
    Object.keys(props.data).length > 0,
)

const value = computed<string | undefined>(() => {
  const data = props.data
  if (typeof data === 'object' && data !== null) return
  if (typeof data === 'bigint') return `${String(data)}n`
  if (data == null || typeof data === 'symbol') return String(data)
  if (typeof data === 'function')
    return `function ${(data as Function).name}(...)`
  return JSON.stringify(data)
})
const valueColor = useHighlightColor(value)

const valueHint = computed(() => {
  const { valueHint } = currentParser.value
  if (!valueHint) return
  return valueHint.call(parserModule.value, props.id, props.data)
})

const { copy, copied } = useClipboard()
function copyHint() {
  valueHint.value && copy(valueHint.value)
}

const properties = useTemplateRefsList<InstanceType<typeof AstProperty>>()
watchEffect(() => {
  const focusing = properties.value.some((p) => p.isFocusing)
  emit('update:focus', focusing)
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
    <span
      v-if="valueHint"
      title="Copy"
      inline-flex
      cursor-copy
      select-none
      items-center
      gap1
      whitespace-pre
      op40
      @click="copyHint"
    >
      <span> ({{ valueHint }})</span>
      <div v-if="copied" class="i-ri:check-line inline-block text-green" />
    </span>
    <span op70>,</span>
  </span>
</template>
