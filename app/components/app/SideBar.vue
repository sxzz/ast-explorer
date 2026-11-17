<script setup lang="ts">
import { onErrorCaptured, ref, watch } from 'vue'
import IconPreview from '~/components/IconPreview.vue'
import Loading from '~/components/Loading.vue'
import ParserOptions from '~/components/parser/Options.vue'
import {
  currentParser,
  currentParserGui as ParserGui,
} from '~/state/parser/parser'

const error = ref<Error>()

watch(
  () => currentParser.value,
  () => (error.value = undefined),
)

onErrorCaptured((err) => {
  console.error(err)
  error.value = err
  return false
})
</script>

<template>
  <aside flex="~ col" gap3 px4 py3>
    <div flex="~ y-center" gap2 border-b border-base pb3>
      <IconPreview :value="currentParser.icon" />
      <h2 min-w-0 flex-1 truncate font-mono>{{ currentParser.label }}</h2>
      <ParserOptions
        v-if="currentParser.options.configurable"
        aria-label="Parser Options"
        nav-button
        tooltip="Parser Options"
      />
    </div>

    <span v-if="error">
      {{ error }}
    </span>
    <Suspense v-else :timeout="0">
      <ParserGui v-if="ParserGui" w-full class="sidebar-gui" />
      <template #fallback><Loading /></template>
    </Suspense>
  </aside>
</template>

<style>
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
