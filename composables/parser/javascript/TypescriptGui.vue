<script lang="ts">
import Typescript from 'typescript'
const useOption = makeUseOption<
  Typescript.CreateSourceFileOptions & { scriptKind: Typescript.ScriptKind }
>()
</script>

<script setup lang="ts">
const scriptKind = useOption('scriptKind', Typescript.ScriptKind.TS, true)
const languageVersion = useOption(
  'languageVersion',
  Typescript.ScriptTarget.Latest,
  true,
)

const versions = Object.entries(Typescript.ScriptTarget).filter(
  ([_, value]) => typeof value === 'number',
)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label flex="~ col" gap1>
      <span>sourceType</span>
      <select v-model="scriptKind">
        <option
          v-for="kind in Object.entries(Typescript.ScriptKind).filter(
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
