<script setup lang="ts">
defineProps<{
  tabs: {
    label: string
    value: any
  }[]
}>()

const innerActiveTab = defineModel()

provide('activeTab', innerActiveTab)
</script>

<template>
  <div class="w-full flex border-b">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="[
        'px-4 py-2 text-sm font-medium',
        innerActiveTab === tab.value
          ? 'text-emerald-600 border-b-2 border-emerald-600'
          : 'text-gray-500 hover:text-emerald-500',
      ]"
      @click="innerActiveTab = tab.value"
    >
      {{ tab.label }}
    </button>
  </div>

  <div w-full>
    <slot />
  </div>
</template>
