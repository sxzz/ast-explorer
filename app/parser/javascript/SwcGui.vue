<script lang="ts">
import type { ParserConfig } from '@swc/wasm-web'
const useOption = makeUseOption<ParserConfig>()
</script>

<script setup lang="ts">
const language = useOption('syntax', 'ecmascript', true)
const jsx = useOption('jsx')
const tsx = useOption('tsx')
const decorators = useOption('decorators')
const decoratorsBeforeExport = useOption('decoratorsBeforeExport')
const functionBind = useOption('functionBind')
const importAssertions = useOption('importAssertions')
const dynamicImport = useOption('dynamicImport')
const exportDefaultFrom = useOption('exportDefaultFrom')

watch(language, (language) => {
  if (language === 'ecmascript') {
    jsx.value = tsx.value
    tsx.value = dynamicImport.value = false
  } else {
    tsx.value = jsx.value
    jsx.value =
      decoratorsBeforeExport.value =
      functionBind.value =
      importAssertions.value =
      exportDefaultFrom.value =
        false
  }
})
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <span>Language</span>
      <select v-model="language">
        <option value="ecmascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
      </select>
    </label>

    <label>
      <AppSwitch v-if="language === 'ecmascript'" v-model="jsx" />
      <AppSwitch v-else v-model="tsx" />
      <span>{{ language === 'ecmascript' ? 'JSX' : 'TSX' }}</span>
    </label>

    <label>
      <AppSwitch v-model="decorators" />
      <span>decorators</span>
    </label>

    <template v-if="language === 'ecmascript'">
      <label ml6>
        <AppSwitch v-model="decoratorsBeforeExport" />
        <span>beforeExport</span>
      </label>

      <label>
        <AppSwitch v-model="functionBind" />
        <span>functionBind</span>
      </label>

      <label>
        <AppSwitch v-model="importAssertions" />
        <span>importAssertions</span>
      </label>

      <label>
        <AppSwitch v-model="exportDefaultFrom" />
        <span>exportDefaultFrom</span>
      </label>
    </template>

    <template v-else>
      <label>
        <AppSwitch v-model="dynamicImport" />
        <span>dynamicImport</span>
      </label>
    </template>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
