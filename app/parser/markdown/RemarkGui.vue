<script lang="ts">
import type { RemarkOptions } from './index'

const useOption = makeUseOption<RemarkOptions>()
</script>

<script setup lang="ts">
const mdx = useOption('mdx')
const frontmatter = useOption('frontmatter')
const directive = useOption('directive')
const gfm = useOption('gfm')
const raw = useOption('raw')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <AppSwitch v-model="mdx" />
      <span>use remark-mdx</span>
    </label>

    <label>
      <AppSwitch v-model="frontmatter" />
      <span>use remark-frontmatter</span>
    </label>

    <label>
      <AppSwitch v-model="directive" />
      <span>use remark-directive</span>
    </label>

    <label>
      <AppSwitch v-model="gfm" />
      <span>use remark-gfm</span>
    </label>

    <label>
      <AppSwitch v-model="raw" />
      <span>use rehype-raw</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
