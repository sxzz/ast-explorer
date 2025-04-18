<script lang="ts">
import type { RemarkOptions } from './markdown'

const useOption = makeUseOption<RemarkOptions>()
</script>

<script setup lang="ts">
const mdx = useOption('mdx')
const frontmatter = useOption('frontmatter')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <input v-model="mdx" type="checkbox" switch />
      <span>use remark-mdx</span>
    </label>

    <label>
      <input v-model="frontmatter" type="checkbox" switch />
      <span>use remark-frontmatter</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
