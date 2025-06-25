<script setup lang="ts">
import { ast } from '~/state/parser/module'
import { injectProps } from '~/types';

const { index } = inject(injectProps)
console.log('ast', ast.value[index], index)
const currentAST = computed(() => ast.value[index]) 
</script>

<template>
  <div w-full overflow-auto pl4 text-sm leading-relaxed font-mono>
    <AstProperty :value="currentAST" root open />
  </div>
</template>
