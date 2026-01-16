<script lang="ts">
import type { TreeSitterOptions } from './tree-sitter'

const useOption = makeUseOption<TreeSitterOptions>()
</script>

<script setup lang="ts">
const wasmUrl = useOption('wasmUrl')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label flex flex-col gap1>
      <span>WASM:</span>
      <textarea
        v-model="wasmUrl"
        text-md
        h-32
        border
        rounded-md
        px1
        py0.5
        accent-current
      />
    </label>
    <div text-right>
      <a
        href="https://github.com/tree-sitter/tree-sitter/wiki/List-of-parsers"
        target="_blank"
      >
        Parser List
      </a>
    </div>
  </div>
</template>
