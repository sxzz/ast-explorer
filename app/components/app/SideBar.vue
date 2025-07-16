<script setup lang="ts">
import {
  currentParser,
  currentParserGui as ParserGui,
} from '~/state/parser/parser'
</script>

<template>
  <div flex="~ y-center col" gap2 px3 py2>
    <div>
      <IconPreview :value="currentParser.icon" size="5em" />
    </div>
    <h2 flex="~ center" gap2 text-lg font-bold>
      Parser Options
      <ParserOptions v-if="currentParser.options.configurable" nav-button />
    </h2>
    <Suspense :timeout="0">
      <ParserGui v-if="ParserGui" w-full class="sidebar-gui" />
      <template #fallback><Loading /></template>
    </Suspense>
  </div>
</template>

<style>
.sidebar-gui span,
.sidebar-gui summary {
  --at-apply: 'op85';
}
</style>
