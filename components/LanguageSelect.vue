<script setup lang="ts">
import { type Language } from '~/composables/language'

const changeLang = (language: Language) => {
  currentLanguageId.value = language
}
</script>

<template>
  <VMenu :class="{ dark: isDark }" flex>
    <button flex="~ gap-1" items-center>
      <div :class="currentLanguage.icon" />
      {{ currentLanguage.label }}
    </button>
    <template #popper>
      <CommonDropdownItem
        v-for="(lang, id) in LANGUAGES"
        :key="id"
        :icon="lang.icon"
        :text="lang.label"
        :checked="currentLanguageId === id"
        @click="changeLang(id)"
      />
    </template>
  </VMenu>
</template>
