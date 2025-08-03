<script setup lang="ts">
const props = defineProps<{
  data: any
  open?: boolean
}>()
const start = computed(() => (Array.isArray(props.data) ? '[' : '{'))
const end = computed(() => (Array.isArray(props.data) ? ']' : '}'))
</script>

<template>
  <span op70>{{ start }}{{ open ? '' : '&nbsp;' }}</span>
  <slot />
  <span op70>{{ open ? '' : '&nbsp;' }}{{ end }}</span>
</template>
