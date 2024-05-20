<script setup lang="ts">
import { currentParserGui as ParserGui } from '~/composables/state/parser'
</script>

<template>
  <div flex="~ col" items-center gap2 p2>
    <div>
      <IconPreview :value="currentParser.icon" size="5em" />
    </div>
    <h2 flex items-center justify-center gap2 text-lg font-bold>
      Parser Options
      <ParserOptions v-if="currentParser.options.configurable" />
    </h2>
    <Suspense :timeout="0">
      <ParserGui v-if="ParserGui" w-full />
      <template #fallback>
        <div class="flex items-center justify-center gap1">
          <div i-ri:loader-4-fill animate-spin />
          <span>Loading...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>
