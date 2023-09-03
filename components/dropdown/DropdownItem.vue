<script setup lang="ts">
import { dropdownContextKey } from './ctx'

defineProps<{
  text?: string
  description?: string
  icon?: string
  checked?: boolean
}>()
const emit = defineEmits(['click'])

const { hide } = inject(dropdownContextKey, undefined) || {}

const el = ref<HTMLDivElement>()

const handleClick = (evt: MouseEvent) => {
  hide?.()
  emit('click', evt)
}
</script>

<template>
  <div
    v-bind="$attrs"
    ref="el"
    hover-bg-active
    flex="~ gap-2"
    cursor-pointer
    items-center
    justify-between
    px3
    py2
    :aria-label="text"
    @click="handleClick"
  >
    <div flex="~ gap-2" items-center>
      <div v-if="icon" :class="icon" />
      <slot>{{ text }}</slot>
      <div v-if="!checked" h-1.2em w-1.2em />
    </div>

    <div v-if="checked" i-ri:check-line />
  </div>
</template>
