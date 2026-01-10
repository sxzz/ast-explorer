<script setup lang="ts">
import { currentLanguage, currentLanguageId } from '~/state/parser/parser'
import type { Language } from '#imports'

function changeLanguage(language: Language) {
  currentLanguageId.value = language
}
</script>

<template>
  <VMenu
    :class="{ dark: isDark }"
    :triggers="['hover', 'click']"
    placement="bottom-start"
    :delay="0"
  >
    <button flex="~ center" gap1>
      <div :class="currentLanguage.icon" />
      {{ currentLanguage.label }}
    </button>
    <template #popper>
      <div max-h-80vh flex flex-col overflow-y-auto>
        <DropdownItem
          v-for="(lang, id) in LANGUAGES"
          :key="id"
          :icon="lang.icon"
          :text="lang.label"
          :checked="currentLanguageId === id"
          @click="changeLanguage(id)"
        />
      </div>
    </template>
  </VMenu>
</template>
