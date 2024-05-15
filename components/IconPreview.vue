<script setup lang="ts">
defineProps<{
  value: string
}>()
</script>

<template>
  <img
    v-if="value.startsWith('https://')"
    :src="value"
    w="1.2em"
    h="1.2em"
    object-contain
  />
  <div v-else :class="value" />
</template>
