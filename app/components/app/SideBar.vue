<script setup lang="ts">
import {
  currentParser,
  currentParserGui as ParserGui,
} from '~/state/parser/parser'
</script>

<template>
  <aside flex="~ col" gap4 px5 py5>
    <div flex="~ col center" gap2.5>
      <div class="parser-orb">
        <IconPreview :value="currentParser.icon" size="3.5em" />
      </div>
      <div flex="~ col center" gap0.5>
        <span
          class="text-[0.6875rem] text-mute font-medium tracking-[0.18em] uppercase"
          >Active Parser</span
        >
        <span class="text-base leading-tight font-mono">
          {{ currentParser.label }}
        </span>
      </div>
    </div>

    <div class="h-px w-full bg-$c-border" />

    <div flex="~ y-center" justify-between>
      <div flex="~ col">
        <span
          class="text-[0.6875rem] text-mute font-medium tracking-[0.18em] uppercase"
          >Configure</span
        >
        <h2 class="mt-0.5 text-base font-semibold leading-tight">
          Parser Options
        </h2>
      </div>
      <ParserOptions v-if="currentParser.options.configurable" nav-button />
    </div>

    <Suspense :timeout="0">
      <ParserGui v-if="ParserGui" w-full class="sidebar-gui" />
      <template #fallback><Loading /></template>
    </Suspense>
  </aside>
</template>

<style>
.parser-orb {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 9999px;
  border: 1px solid var(--c-border);
  background: var(--c-bg-base);
}
.parser-orb::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 9999px;
  border: 1px solid var(--c-accent-tint);
}
.parser-orb::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 9999px;
  border: 1px dashed var(--c-border);
  opacity: 0.5;
}

.sidebar-gui {
  --at-apply: 'text-sm';
}
.sidebar-gui span,
.sidebar-gui summary {
  --at-apply: 'op85';
}

.sidebar-gui label {
  flex-wrap: wrap;
}
</style>
