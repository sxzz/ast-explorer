<script lang="ts">
import { makeUseOption } from '~/composables/options'
import { parserModulePromise } from '~/state/parser/module'
import type {
  TypescriptWasmContext,
  TypescriptWasmOptions,
} from './typescript-wasm'

const useOption = makeUseOption<TypescriptWasmOptions>()
</script>

<script setup lang="ts">
const { ast }: TypescriptWasmContext = await parserModulePromise.value
const scriptKind = useOption('scriptKind', ast.ScriptKind.TS, true)

const scriptKinds = Object.entries(ast.ScriptKind).filter(
  ([_, value]) => typeof value === 'number',
)
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label flex="~ col" gap1>
      <span>scriptKind</span>
      <select v-model="scriptKind">
        <option v-for="kind of scriptKinds" :key="kind[0]" :value="kind[1]">
          {{ kind[0] }}
        </option>
      </select>
    </label>
  </div>
</template>
