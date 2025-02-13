<script lang="ts">
import { useOptions } from '~/state/parser/options'
import type { ParserOptions, ParserPlugin } from '@babel/parser'

const useOption = makeUseOption<ParserOptions>()
function usePlugin(name: ParserPlugin, deps: Ref<boolean | undefined>[] = []) {
  const value = useOptions(
    (opt: ParserOptions) => !!opt.plugins?.includes?.(name),
    (value, opt) => {
      if (!Array.isArray(opt.plugins)) opt.plugins = []

      if (value) {
        deps.forEach((dep) => !dep.value && (dep.value = true))
        opt.plugins.push(name)
      } else {
        opt.plugins = del(opt.plugins, [name])
      }
    },
  )

  watch(
    () => deps.map((dep) => dep.value),
    (deps) => {
      if (value.value && deps.some((dep) => !dep)) {
        value.value = false
      }
    },
  )

  return value
}
</script>

<script setup lang="ts">
// options
const allowImportExportEverywhere = useOption('allowImportExportEverywhere')
const allowAwaitOutsideFunction = useOption('allowAwaitOutsideFunction')
const allowNewTargetOutsideFunction = useOption('allowNewTargetOutsideFunction')
const allowReturnOutsideFunction = useOption('allowReturnOutsideFunction')
const allowSuperOutsideMethod = useOption('allowSuperOutsideMethod')
const allowUndeclaredExports = useOption('allowUndeclaredExports')
const attachComment = useOption('attachComment', true)
const createImportExpressions = useOption('createImportExpressions')
const createParenthesizedExpressions = useOption(
  'createParenthesizedExpressions',
)
const sourceType = useOption('sourceType', 'script', true)
const errorRecovery = useOption('errorRecovery')
const ranges = useOption('ranges')
const tokens = useOption('tokens')

// not popular
// const annexB = useOption('annexB')
// const sourceFilename = useOption('sourceFilename')
// const startColumn = useOption('startColumn')
// const startLine = useOption('startLine')
// const strictMode = useOption('strictMode')

// misc
const estree = usePlugin('estree')

// languages
const typeScript = usePlugin('typescript')
const jsx = usePlugin('jsx')
const flow = usePlugin('flow')
const v8intrinsic = usePlugin('v8intrinsic')

// proposals
const doExpressions = usePlugin('doExpressions')
const asyncDoExpressions = usePlugin('asyncDoExpressions', [doExpressions])

const decorators = useOptions(
  (opt: ParserOptions) =>
    !!(
      opt.plugins?.includes?.('decorators') ||
      opt.plugins?.includes?.('decorators-legacy')
    ),
  (value, opt) => {
    if (!Array.isArray(opt.plugins)) opt.plugins = []
    if (value) {
      opt.plugins.push('decorators')
    } else {
      opt.plugins = del(opt.plugins, ['decorators', 'decorators-legacy'])
    }
  },
)
const decoratorsLegacy = useOptions(
  (opt: ParserOptions) => opt.plugins?.includes?.('decorators-legacy'),
  (value, opt) => {
    if (!Array.isArray(opt.plugins)) opt.plugins = []
    if (value) {
      opt.plugins.push('decorators-legacy')
      opt.plugins = del(opt.plugins, ['decorators'])
    } else {
      opt.plugins.push('decorators')
      opt.plugins = del(opt.plugins, ['decorators-legacy'])
    }
  },
)
const decoratorAutoAccessors = usePlugin('decoratorAutoAccessors', [decorators])
const decimal = usePlugin('decimal')
const deferredImportEvaluation = usePlugin('deferredImportEvaluation')
const destructuringPrivate = usePlugin('destructuringPrivate')
const explicitResourceManagement = usePlugin('explicitResourceManagement')
const exportDefaultFrom = usePlugin('exportDefaultFrom')
const functionBind = usePlugin('functionBind')
const functionSent = usePlugin('functionSent')
const deprecatedImportAssert = usePlugin('deprecatedImportAssert')
const importReflection = usePlugin('importReflection')
const moduleBlocks = usePlugin('moduleBlocks')
const optionalChainingAssign = usePlugin('optionalChainingAssign')
const partialApplication = usePlugin('partialApplication')
const pipelineOperator = usePlugin('pipelineOperator')
const recordAndTuple = usePlugin('recordAndTuple')
const sourcePhaseImports = usePlugin('sourcePhaseImports')
const throwExpressions = usePlugin('throwExpressions')
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <input v-model="estree" type="checkbox" switch />
      <span>ESTree</span>
    </label>

    <h3 border-t pt1 text-center font-bold>Options</h3>

    <label>
      <span>sourceType</span>
      <select v-model="sourceType">
        <option value="script">script</option>
        <option value="module">module</option>
        <option value="unambiguous">unambiguous</option>
      </select>
    </label>

    <details>
      <summary cursor-pointer>allow syntaxes...</summary>
      <div flex="~ col gap2 wrap" ml3 mt1 text-xs>
        <label>
          <input v-model="allowImportExportEverywhere" type="checkbox" />
          <span>allowImportExportEverywhere</span>
        </label>

        <label>
          <input v-model="allowAwaitOutsideFunction" type="checkbox" />
          <span>allowAwaitOutsideFunction</span>
        </label>

        <label text-xs>
          <input v-model="allowNewTargetOutsideFunction" type="checkbox" />
          <span>allowNewTargetOutsideFunction</span>
        </label>

        <label>
          <input v-model="allowReturnOutsideFunction" type="checkbox" />
          <span>allowReturnOutsideFunction</span>
        </label>

        <label>
          <input v-model="allowSuperOutsideMethod" type="checkbox" />
          <span>allowSuperOutsideMethod</span>
        </label>

        <label>
          <input v-model="allowUndeclaredExports" type="checkbox" />
          <span>allowUndeclaredExports</span>
        </label>
      </div>
    </details>

    <details>
      <summary cursor-pointer>create expressions...</summary>
      <div flex="~ col gap2 wrap" ml3 mt1 text-xs>
        <label>
          <input v-model="createImportExpressions" type="checkbox" />
          <span>createImportExpressions</span>
        </label>

        <label text-xs>
          <input v-model="createParenthesizedExpressions" type="checkbox" />
          <span>createParenthesizedExpressions</span>
        </label>
      </div>
    </details>

    <label>
      <input v-model="errorRecovery" type="checkbox" switch />
      <span>errorRecovery</span>
    </label>

    <label>
      <input v-model="ranges" type="checkbox" switch />
      <span>ranges</span>
    </label>

    <label>
      <input v-model="tokens" type="checkbox" switch />
      <span>tokens</span>
    </label>

    <label>
      <input v-model="attachComment" type="checkbox" switch />
      <span>attachComment</span>
    </label>

    <h3 border-t pt1 text-center font-bold>Languages</h3>

    <label>
      <input v-model="typeScript" type="checkbox" switch />
      <span>TypeScript</span>
    </label>

    <label>
      <input v-model="jsx" type="checkbox" switch />
      <span>JSX</span>
    </label>

    <label>
      <input v-model="flow" type="checkbox" switch />
      <span>Flow</span>
    </label>

    <label>
      <input v-model="v8intrinsic" type="checkbox" switch />
      <span>V8 Intrinsic</span>
    </label>

    <h3 border-t pt1 text-center font-bold>ES Modules</h3>

    <label>
      <input v-model="deprecatedImportAssert" type="checkbox" switch />
      <span>deprecatedImportAssert</span>
    </label>

    <label>
      <!-- Stage 3 -->
      <input v-model="sourcePhaseImports" type="checkbox" switch />
      <span>sourcePhaseImports</span>
    </label>

    <label>
      <!-- Stage 3 -->
      <input v-model="importReflection" type="checkbox" switch />
      <span>importReflection</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <input v-model="moduleBlocks" type="checkbox" switch />
      <span>moduleBlocks</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <input v-model="deferredImportEvaluation" type="checkbox" switch />
      <span>deferredImportEvaluation</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <input v-model="exportDefaultFrom" type="checkbox" switch />
      <span>exportDefaultFrom</span>
    </label>

    <h3 border-t pt1 text-center font-bold>Functions</h3>

    <label>
      <!-- Stage 2 -->
      <input v-model="pipelineOperator" type="checkbox" switch />
      <span>pipelineOperator</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <input v-model="functionSent" type="checkbox" switch />
      <span>functionSent</span>
    </label>

    <label>
      <!-- Stage 0 -->
      <input v-model="functionBind" type="checkbox" switch />
      <span>functionBind</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <input v-model="partialApplication" type="checkbox" switch />
      <span>partialApplication</span>
    </label>

    <h3 border-t pt1 text-center font-bold>Syntaxes</h3>

    <label>
      <!-- Stage 3 -->
      <input v-model="explicitResourceManagement" type="checkbox" switch />
      <span>explicitResourceManagement</span>
    </label>

    <label>
      <!-- Stage 3 -->
      <input v-model="decorators" type="checkbox" switch />
      <span>decorators</span>
    </label>

    <label ml6>
      <input v-model="decoratorsLegacy" type="checkbox" switch />
      <span>legacy</span>
    </label>

    <label ml6>
      <input v-model="decoratorAutoAccessors" type="checkbox" switch />
      <span>autoAccessors</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <input v-model="doExpressions" type="checkbox" switch />
      <span>doExpressions</span>
    </label>

    <label ml6>
      <!-- Stage 1 -->
      <input v-model="asyncDoExpressions" type="checkbox" switch />
      <span>async</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <input v-model="recordAndTuple" type="checkbox" switch />
      <span>recordAndTuple</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <input v-model="throwExpressions" type="checkbox" switch />
      <span>throwExpressions</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <input v-model="destructuringPrivate" type="checkbox" switch />
      <span>destructuringPrivate</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <input v-model="optionalChainingAssign" type="checkbox" switch />
      <span>optionalChainingAssign</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <input v-model="decimal" type="checkbox" switch />
      <span>decimal</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
