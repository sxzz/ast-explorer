<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'
import {
  currentLanguage,
  currentParser,
  currentParserId,
  setParserId,
} from '~/state/parser/parser'

function changeParser(parser: string) {
  setParserId(parser)
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
        <IconPreview :value="currentParser.icon" />
        <span font-mono>{{ currentParser.label }}</span>
      </button>
    </template>

    <div max-h-80vh flex flex-col overflow-y-auto>
      <DropdownMenuItem
        v-for="parser of currentLanguage.parsers"
        :key="parser.id"
        as-child
      >
        <DropdownItem
          :icon="parser.icon"
          :text="parser.label"
          :checked="currentParserId === parser.id"
          font-mono
          @click="changeParser(parser.id)"
        />
      </DropdownMenuItem>
    </div>
  </DropdownMenu>
</template>
