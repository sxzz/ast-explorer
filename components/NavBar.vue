<template>
  <div p2 flex justify-between items-center>
    <div flex="~ gap4">
      <h1 font-bold text-lg>AST Viewer</h1>
      <LanguageSelect />
      <LanguageOptions v-if="currentLanguage.options.configurable" />
    </div>

    <button @click="toggleDark()">
      <div i-ri:sun-line dark:i-ri:moon-line />
    </button>
  </div>
</template>
