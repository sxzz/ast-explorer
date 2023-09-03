<script setup lang="ts">
import { type Language } from '~/composables/language'

function changeLanguage(language: Language) {
  currentLanguageId.value = language
}

function setParser() {
  currentParserId.value = Object.keys(currentLanguage.value.parsers)[0]
}

if (!currentParserId.value) setParser()
</script>

<template>
  <VMenu :class="{ dark: isDark }" flex>
    <button flex="~ gap-1" items-center>
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
