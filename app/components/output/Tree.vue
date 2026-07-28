<script setup lang="ts">
import { ast } from '~/state/parser/module'

function showDialog() {
  showAstTreeStyles.value = true
}
</script>

<template>
  <div relative w-full>
    <div
      h-full
      w-full
      overflow-auto
      pl4
      text-sm
      leading-relaxed
      font-mono
      :style="astTreeStyles"
    >
      <AstProperty :value="ast" open root />
    </div>
    <AppTooltip text="AST Tree Styles">
      <button
        aria-label="AST Tree Styles"
        absolute
        right-2
        top-2
        p="0.8"
        nav-button
        @click="showDialog"
      >
        <div i-ri:magic-line />
      </button>
    </AppTooltip>
    <OutputTreeStyles />
  </div>
</template>
