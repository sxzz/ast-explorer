<script lang="ts">
import { parserModulePromise } from '~/state/parser/module'
import type Typescript from 'typescript'

const useOption = makeUseOption<
  Typescript.CreateSourceFileOptions & { scriptKind: Typescript.ScriptKind }
>()
</script>

<script setup lang="ts">
const ts = await parserModulePromise.value
if (ts.versionMajorMinor === '7.0') {
  throw new Error(
    'TypeScript 7.0 is not supported yet. Please use TypeScript 6.x or below.',
  )
}
const scriptKind = useOption('scriptKind', ts.ScriptKind.TS, true)
const languageVersion = useOption(
  'languageVersion',
  ts.ScriptTarget.Latest,
  true,
)

const versions = Object.entries(ts.ScriptTarget).filter(
  ([_, value]) => typeof value === 'number',
)
</script>

<template>
  <div
    v-if="ts && ts.versionMajorMinor !== '7.0'"
    flex="~ col"
    gap2
    text-sm
    font-mono
  >
    <label flex="~ col" gap1>
      <span>sourceType</span>
      <select v-model="scriptKind">
        <option
          v-for="kind in Object.entries(ts.ScriptKind).filter(
            ([_, value]) => typeof value === 'number',
          )"
          :key="kind[0]"
          :value="kind[1]"
        >
          {{ kind[0] }}
        </option>
      </select>
    </label>

    <label flex="~ col" gap1>
      <span>languageVersion</span>
      <select v-model="languageVersion">
        <option
          v-for="version of versions"
          :key="version[0]"
          :value="version[1]"
        >
          {{ version[0] }}
        </option>
      </select>
    </label>
  </div>
</template>
