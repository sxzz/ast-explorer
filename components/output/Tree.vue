<script setup lang="ts">
import { ast } from '~/state/parser/module'

const astStyles = computed(() => ({
  fontFamily: astViewSettings.value.fontFamily,
  fontSize: `${astViewSettings.value.fontSize}px`,
  lineHeight: astViewSettings.value.lineHeight,
}))
</script>

<template>
  <div
    w-full
    overflow-auto
    pl4
    text-sm
    leading-relaxed
    font-mono
    :style="astStyles"
  >
    <AstProperty :value="ast" root open />
  </div>
</template>
