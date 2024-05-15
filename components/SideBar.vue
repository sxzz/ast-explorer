<script setup lang="ts">
import { currentParserGui as ParserGui } from '~/composables/language'
</script>

<template>
  <div flex="~ col" items-center gap2 border-r p2>
    <div>
      <IconPreview :value="currentParser.icon" size="5em" />
    </div>
    <h2 flex items-center justify-center gap2 text-lg font-bold>
      Parser Options
      <ParserOptions v-if="currentParser.options.configurable" />
    </h2>
    <div v-if="ParserGui" w-full>
      <ParserGui />
    </div>
  </div>
</template>
