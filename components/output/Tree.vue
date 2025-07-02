<script setup lang="ts">
import { ast } from '~/state/parser/module'
import { injectProps } from '~/types'

const { index } = inject(injectProps)!
const currentAST = computed(() => ast.value[index])

function showDialog() {
  showAstTreeStyles.value = true
}
</script>

<template>
  <div relative w-full>
    <div h-full w-full overflow-auto pl4 text-sm leading-relaxed font-mono :style="astTreeStyles">
      <AstProperty :value="currentAST" root open />
    </div>
    <button absolute right-2 top-2 p="0.8" title="AST Tree Styles" nav-button @click="showDialog">
      <div i-ri:magic-line />
    </button>
    <OutputTreeStyles />
  </div>
</template>
