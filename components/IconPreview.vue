<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: string
    size?: string
  }>(),
  { size: '1.2em' },
)

</script>

<template>
  <img v-if="value.startsWith('https://')" :src="value" :style="{ width: size, height: size }" object-contain />
  <div v-else :class="value" :style="{ width: size, height: size }" />
</template>
