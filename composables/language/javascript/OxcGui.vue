<script setup lang="ts">
import { useOption } from './oxc'

const sourceType = useOption('sourceType', 'script', true)
const sourceFilename = useOption('sourceFilename', '', true)
</script>

<template>
  <div flex="~ col gap4" text-sm font-mono>
    <label flex="~ col gap1">
      <span>source type</span>
      <select v-model="sourceType" p1>
        <option value="script">script</option>
        <option value="module">module</option>
      </select>
    </label>

    <label flex="~ col gap1">
      <span>source filename</span>
      <input v-model="sourceFilename" p1 />
    </label>
  </div>
</template>
