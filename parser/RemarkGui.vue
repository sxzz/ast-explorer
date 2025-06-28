<script lang="ts">
import  { type RemarkOptions, remarkAst } from './markdown'

const useOption = makeUseOption<RemarkOptions>(remarkAst.id)
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
      <input v-model="mdx" type="checkbox" switch />
      <span>use remark-mdx</span>
    </label>

    <label>
      <input v-model="frontmatter" type="checkbox" switch />
      <span>use remark-frontmatter</span>
    </label>

    <label>
      <input v-model="directive" type="checkbox" switch />
      <span>use remark-directive</span>
    </label>

    <label>
      <input v-model="gfm" type="checkbox" switch />
      <span>use remark-gfm</span>
    </label>

    <label>
      <input v-model="raw" type="checkbox" switch />
      <span>use rehype-raw</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
