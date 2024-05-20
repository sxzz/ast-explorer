<script setup lang="ts">
const props = defineProps<{ data: any }>()
const start = computed(() => (Array.isArray(props.data) ? '[' : '{'))
const end = computed(() => (Array.isArray(props.data) ? ']' : '}'))
</script>

<template>
  <span op70>{{ start }}&nbsp;</span>
  <slot />
  <span op70>&nbsp;{{ end }}</span>
</template>
