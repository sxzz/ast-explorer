<script setup lang="ts">
import { ast } from '~/state/parser/module'

function showDialog() {
  showAstTreeStyles.value = true
}
</script>

<template>
  <div relative w-full :style="astTreeStyles">
    <div h-full w-full overflow-auto pl4 text-sm leading-relaxed font-mono>
      <AstProperty :value="ast" root open />
    </div>
    <button
      absolute
      right-2
      top-2
      p="0.8"
      title="AST Tree Styles"
      nav-button
      @click="showDialog"
    >
      <div i-ri:magic-line />
    </button>
    <OutputTreeStyles />
  </div>
</template>
