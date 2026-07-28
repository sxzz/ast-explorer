<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'
import { currentLanguage, currentLanguageId } from '~/state/parser/parser'
import type { Language } from '#imports'

function changeLanguage(language: Language) {
  currentLanguageId.value = language
}
</script>

<template>
  <DropdownMenu>
    <template #trigger="{ openFromPointer, schedulePointerClose }">
      <button
        flex="~ center"
        gap1
        @mouseenter="openFromPointer"
        @mouseleave="schedulePointerClose"
      >
        <div :class="currentLanguage.icon" />
        {{ currentLanguage.label }}
      </button>
    </template>

    <div max-h-80vh flex flex-col overflow-y-auto>
      <DropdownMenuItem v-for="(lang, id) in LANGUAGES" :key="id" as-child>
        <DropdownItem
          :icon="lang.icon"
          :text="lang.label"
          :checked="currentLanguageId === id"
          @click="changeLanguage(id)"
        />
      </DropdownMenuItem>
    </div>
  </DropdownMenu>
</template>
