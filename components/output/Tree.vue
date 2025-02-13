<script setup lang="ts">
import { ast } from '~/state/parser/module'
</script>

<template>
  <div w-full overflow-auto pl4 text-sm leading-relaxed font-mono>
    <AstProperty :value="ast" root open />
  </div>
</template>
