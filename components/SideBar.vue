<script setup lang="ts">
import { currentParserGui as ParserGui } from '~/composables/language'
</script>

<template>
  <div border-r p2>
    <h2 flex="~ gap1" mb3 items-center justify-center text-lg font-bold>
      Parser Options
      <ParserOptions v-if="currentParser.options.configurable" />
    </h2>
    <template v-if="ParserGui">
      <ParserGui />
    </template>
  </div>
</template>
