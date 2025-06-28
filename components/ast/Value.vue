<script setup lang="ts">
import { shouldHideKey } from '~/state/output'
import { parserModules } from '~/state/parser/module'
import type { AstProperty } from '#components'
import { injectProps } from '~/types';

const props = defineProps<{
  id?: string | number
  data: any
}>()
const emit = defineEmits<{
  'update:focus': [value: boolean]
}>()

const { currentParser, index } = inject(injectProps)!
const parserModule = computedAsync(async () => {
  return await parserModules.value[index]
})

const rawValue = computed(() => {
  const { onValue } = currentParser.value
  return onValue ? onValue(props.data) : props.data
})

const hasChildren = computed(
  () =>
    typeof rawValue.value === 'object' &&
    rawValue.value != null &&
    Object.keys(rawValue.value).length > 0,
)

const value = computed<string | undefined>(() => {
  const data = rawValue.value
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
  return valueHint.call(parserModule.value, props.id, rawValue.value)
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
  <template v-if="typeof rawValue === 'object' && rawValue != null">
    <AstBrackets :data="rawValue">
      <div v-if="hasChildren" ml6>
        <template v-for="(item, key) of rawValue" :key="key">
          <AstProperty v-if="!shouldHideKey(key)" :id="key" :ref="properties.set" :value="item" />
        </template>
      </div>
    </AstBrackets>
  </template>
  <span v-else>
    <span :style="{ color: valueColor }" whitespace-pre v-text="value" />
    <span v-if="valueHint" title="Copy" inline-flex cursor-copy select-none items-center gap1 whitespace-pre op40
      @click="copyHint">
      <span> ({{ valueHint }})</span>
      <div v-if="copied" class="i-ri:check-line inline-block text-green" />
    </span>
    <span op70>,</span>
  </span>
</template>
