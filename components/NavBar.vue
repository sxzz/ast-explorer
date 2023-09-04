<script setup lang="ts">
import { version } from '../package.json'
</script>

<template>
  <div flex="~ wrap" items-center justify-between p2>
    <div flex="~ gap4">
      <div flex="~ gap1">
        <h1 text-lg font-bold>AST Explorer</h1>
        <small>v{{ version }}</small>
      </div>
      <LanguageSelect />
      <ParserSelect />
      <ParserOptions v-if="currentParser.options.configurable" />
    </div>

    <div flex="~ gap-3">
      <span font-mono text-gray>{{ parserVersion }}</span>
      <button @click="toggleDark">
        <div i-ri:sun-line dark:i-ri:moon-line />
      </button>
      <a
        href="https://github.com/sxzz/ast-explorer"
        target="_blank"
        flex
        items-center
      >
        <div i-ri:github-line />
      </a>
    </div>
  </div>
</template>
