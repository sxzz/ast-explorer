<script lang="ts">
import type { ParserConfig } from '@swc/wasm-web'
import { swc } from './swc';
const useOption = makeUseOption<ParserConfig>(swc.id)
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
      <input
        v-if="language === 'ecmascript'"
        v-model="jsx"
        type="checkbox"
        switch
      />
      <input v-else v-model="tsx" type="checkbox" switch />
      <span>{{ language === 'ecmascript' ? 'JSX' : 'TSX' }}</span>
    </label>

    <label>
      <input v-model="decorators" type="checkbox" switch />
      <span>decorators</span>
    </label>

    <template v-if="language === 'ecmascript'">
      <label ml6>
        <input v-model="decoratorsBeforeExport" type="checkbox" switch />
        <span>beforeExport</span>
      </label>

      <label>
        <input v-model="functionBind" type="checkbox" switch />
        <span>functionBind</span>
      </label>

      <label>
        <input v-model="importAssertions" type="checkbox" switch />
        <span>importAssertions</span>
      </label>

      <label>
        <input v-model="exportDefaultFrom" type="checkbox" switch />
        <span>exportDefaultFrom</span>
      </label>
    </template>

    <template v-else>
      <label>
        <input v-model="dynamicImport" type="checkbox" switch />
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
