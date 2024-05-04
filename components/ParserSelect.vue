<script setup lang="ts">
function changeParser(parser: string) {
  setParserId(parser)
}
</script>

<template>
  <VMenu :class="{ dark: isDark }" flex>
    <button flex="~ gap-1" items-center>
      <div :class="currentParser.icon" />
      <span font-mono>{{ currentParser.label }}</span>
    </button>
    <template #popper>
      <DropdownItem
        v-for="parser of currentLanguage.parsers"
        :key="parser.id"
        :icon="parser.icon"
        :text="parser.label"
        :checked="currentParserId === parser.id"
        font-mono
        @click="changeParser(parser.id)"
      />
    </template>
  </VMenu>
</template>
