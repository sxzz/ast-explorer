<script setup lang="ts">
defineProps<{
  text?: string
  description?: string
  icon?: string
  checked?: boolean
}>()

const el = ref<HTMLDivElement>()
</script>

<template>
  <div
    v-bind="$attrs"
    ref="el"
    flex="~ y-center"
    cursor-pointer
    justify-between
    gap3
    px3.5
    py2
    text-sm
    transition-colors
    duration-100
    :aria-label="text"
    :class="['hover:bg-$c-accent-tint', checked && 'text-accent']"
  >
    <div flex="~ y-center" gap2>
      <IconPreview v-if="icon" :value="icon" />
      <slot>{{ text }}</slot>
      <div v-if="!checked" h="1.2em" w="1.2em" />
    </div>

    <div v-if="checked" i-ri:check-line text-accent />
  </div>
</template>
