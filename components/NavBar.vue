<template>
  <div flex items-center justify-between p2>
    <div flex="~ gap4">
      <h1 text-lg font-bold>AST Explorer</h1>
      <LanguageSelect />
      <LanguageOptions v-if="currentLanguage.options.configurable" />
    </div>

    <div flex="~ gap2">
      <span font-mono text-gray>{{ currentLanguage.version }}</span>
      <button @click="toggleDark">
        <div i-ri:sun-line dark:i-ri:moon-line />
      </button>
    </div>
  </div>
</template>
