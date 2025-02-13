<script setup lang="ts">
import { currentLanguage, currentLanguageId } from '~/state/parser/parser'
import type { Language } from '~/composables/parser'

function changeLanguage(language: Language) {
  currentLanguageId.value = language
}
</script>

<template>
  <VMenu :class="{ dark: isDark }" placement="bottom-start" :delay="0" flex>
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
