<script setup lang="ts">
import { makeUseOption } from '~/composables/options'
import { parserModulePromise } from '~/state/parser/module'
import { setParserId } from '~/state/parser/parser'
import { isLegacyTypescript } from './typescript'
import type Typescript from 'typescript'

const useOption = makeUseOption<
  Typescript.CreateSourceFileOptions & { scriptKind: Typescript.ScriptKind }
>()

const ts = await parserModulePromise.value
const supported = isLegacyTypescript(ts)

const scriptKind = useOption(
  'scriptKind',
  3 satisfies Typescript.ScriptKind.TS,
  true,
)
const languageVersion = useOption(
  'languageVersion',
  99 satisfies Typescript.ScriptTarget.Latest,
  true,
)
</script>

<template>
  <div v-if="!supported" flex="~ col" items-start gap2 text-sm>
    <p>
      TypeScript {{ ts.version }} is not supported here. TypeScript 7 and later
      only ship as a native build, which the TypeScript (WASM) parser runs.
    </p>
    <button pill-button @click="setParserId('typescript-wasm')">
      Switch to TypeScript (WASM)
    </button>
  </div>
  <div v-else flex="~ col" gap2 text-sm font-mono>
    <label flex="~ col" gap1>
      <span>sourceType</span>
      <select v-model="scriptKind">
        <option
          v-for="kind in Object.entries(ts.ScriptKind).filter(
            (entry) => typeof entry[1] === 'number',
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
          v-for="version of Object.entries(ts.ScriptTarget).filter(
            (entry) => typeof entry[1] === 'number',
          )"
          :key="version[0]"
          :value="version[1]"
        >
          {{ version[0] }}
        </option>
      </select>
    </label>
  </div>
</template>
