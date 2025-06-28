<template>
  <div class="flex border-b w-full">
    <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :class="[
      'px-4 py-2 text-sm font-medium',
      activeTab === tab.value
        ? 'text-emerald-600 border-b-2 border-emerald-600'
        : 'text-gray-500 hover:text-emerald-500'
    ]">
      {{ tab.label }}
    </button>
  </div>

  <div class="mt-4 text-sm text-gray-700">
    <slot />
  </div>

</template>

<script setup lang="ts">
defineProps<{
  tabs: {
    label: String,
    value: any,
  }[]
}>()

const activeTab = defineModel()

provide('activeTab', activeTab)
</script>
