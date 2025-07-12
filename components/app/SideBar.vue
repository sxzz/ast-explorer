<script setup lang="ts">
import { currentParsers, currentParsersGuis } from '~/state/parser/parser'
import { activeTab } from '~/state/ui'

const tabs = computed(() => {
  const tabIds = new Set(currentParsers.value.map((p) => p.id))
  return Array.from(tabIds).map((id) => ({ label: id, value: id }))
})

watch(
  tabs,
  () => {
    activeTab.value = tabs.value[0]!.value
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div flex="~ y-center col" gap2 px3 py2>
    <TabsTab v-show="sideBarAvailable" v-model="activeTab" :tabs="tabs">
      <TabsTabPane
        v-for="(tab, idx) in tabs"
        :key="tab.label"
        :label="tab.label"
        :value="tab.value"
      >
        <div flex items-center justify-center>
          <IconPreview :value="currentParsers[idx]!.icon" size="5em" />
        </div>
        <h2 flex="~ center" gap2 text-lg font-bold>
          Parser Options
          <ParserOptions
            v-if="currentParsers[idx]!.options.configurable"
            :parser-id="currentParsers[idx]!.id"
            :index="idx"
            nav-button
          />
        </h2>
        <Suspense :timeout="0">
          <Component
            :is="currentParsersGuis[idx]"
            v-if="currentParsersGuis[idx]"
            w-full
            class="sidebar-gui"
          />
          <template #fallback>
            <Loading />
          </template>
        </Suspense>
      </TabsTabPane>
    </TabsTab>
  </div>
</template>

<style>
.sidebar-gui span,
.sidebar-gui summary {
  --at-apply: 'op85';
}
</style>
