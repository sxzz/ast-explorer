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
    flex
    gap-2
    items-center
    cursor-pointer
    px3
    py2
    hover-bg-active
    :aria-label="text"
    @click="handleClick"
  >
    <div v-if="icon" :class="icon" />
    <slot>
      {{ text }}
    </slot>

    <div v-if="checked" i-ri:check-line />
  </div>
</template>
