<template>
  <div v-show="activeTab === value">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

defineProps<{
  label: string,
  value: string,
}>()

const activeTab = inject('activeTab')
</script>
