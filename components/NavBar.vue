<script setup lang="ts">
import { version } from '../package.json'
</script>

<template>
  <div flex="~ wrap" items-center justify-between p2>
    <div flex="~ gap4">
      <div flex="~ gap1">
        <Logo />
        <h1 text-lg font-bold>AST Explorer</h1>
        <small>v{{ version }}</small>
      </div>
      <LanguageSelect />
      <ParserSelect />
      <ParserOptions v-if="currentParser.options.configurable" />
    </div>

    <div flex="~ gap-3">
      <span op-80>{{ +parseCost.toFixed(1) }} ms</span>
      <span font-mono op-80>{{ parserVersion }}</span>
      <button title="Toggle Left Layout" @click="toggleLeftLayout">
        <div v-if="showLeftLayout" i-ri:layout-column-fill />
        <div v-else i-ri:layout-left-line />
      </button>
      <button title="Toggle Right Layout" @click="toggleRightLayout">
        <div v-if="showRightLayout" i-ri:layout-column-fill rotate-180 />
        <div v-else i-ri:layout-left-line rotate-180 />
      </button>
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
