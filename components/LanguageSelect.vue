<script setup lang="ts">
import type { Language } from '#imports'

function changeLanguage(language: Language) {
  code.value = ''
  currentLanguageId.value = language
}
</script>

<template>
  <VMenu :class="{ dark: isDark }" flex>
    <button flex="~ center" gap1>
      <div :class="currentLanguage.icon" />
      {{ currentLanguage.label }}
    </button>
    <template #popper>
      <DropdownItem
        v-for="(lang, id) in LANGUAGES"
        :key="id"
        :icon="lang.icon"
        :text="lang.label"
        :checked="currentLanguageId === id"
        @click="changeLanguage(id)"
      />
    </template>
  </VMenu>
</template>
