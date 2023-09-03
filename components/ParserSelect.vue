<script setup lang="ts">
function changeParser(parser: string) {
  currentParserId.value = parser
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
        v-for="(parser, id) in currentLanguage.parsers"
        :key="id"
        :icon="parser.icon"
        :text="parser.label"
        :checked="currentParserId === id"
        font-mono
        @click="changeParser(id)"
      />
    </template>
  </VMenu>
</template>
