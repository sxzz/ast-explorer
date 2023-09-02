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
    flex
    cursor-pointer
    items-center
    gap-2
    px3
    py2
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
