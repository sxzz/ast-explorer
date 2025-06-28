<script setup lang="ts">
import {
  currentLanguage,
  setParserId,
} from '~/state/parser/parser'
import { injectProps } from '~/types';

const { currentParser, currentParserId, index } = inject(injectProps)
function changeParser(parserId: string) {
  setParserId(parserId, index)
}
</script>

<template>
  <VMenu :class="{ dark: isDark }" placement="bottom-start" :delay="0" flex>
    <button flex="~ center" gap1>
      <IconPreview :value="currentParser.icon" />
      <span font-mono>{{ currentParser.label }}</span>
    </button>
    <template #popper>
      <div h-200px overflow-y-auto>
        <DropdownItem v-for="parser of currentLanguage.parsers" :key="parser.id" :icon="parser.icon"
          :text="parser.label" :checked="currentParserId === parser.id" font-mono @click="changeParser(parser.id)" />
      </div>
    </template>
  </VMenu>
</template>
