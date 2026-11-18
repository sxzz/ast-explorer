<script setup lang="ts">
import AppCheckbox from '~/components/AppCheckbox.vue'
import AppSwitch from '~/components/AppSwitch.vue'
import { makeUseOption } from '~/composables/options'
import { useDecorators, usePlugin, usePluginWithOptions } from './babel-plugins'
import type { ParserOptions } from '@babel/parser'

const useOption = makeUseOption<ParserOptions>()

// options
const allowImportExportEverywhere = useOption('allowImportExportEverywhere')
const allowAwaitOutsideFunction = useOption('allowAwaitOutsideFunction')
const allowYieldOutsideFunction = useOption('allowYieldOutsideFunction')
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
const locations = useOption('locations', true)
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
const typescript = usePluginWithOptions('typescript', { dts: false })

const jsx = usePlugin('jsx')
const flow = usePlugin('flow')
const v8intrinsic = usePlugin('v8intrinsic')

// proposals
const doExpressions = usePlugin('doExpressions')
const asyncDoExpressions = usePlugin('asyncDoExpressions', {
  deps: [doExpressions],
})

const { decorators, legacy: decoratorsLegacy } = useDecorators()

const optionalChainingAssign = usePlugin('optionalChainingAssign', {
  options: { version: '2023-07' },
})
const partialApplication = usePlugin('partialApplication', {
  options: { version: '2018-07' },
})
const pipelineOperator = usePluginWithOptions('pipelineOperator', {
  proposal: 'hack',
  topicToken: '%',
})

const decoratorAutoAccessors = usePlugin('decoratorAutoAccessors', {
  deps: [decorators],
})
const deferredImportEvaluation = usePlugin('deferredImportEvaluation')
const deferredReexports = usePlugin('deferredReexports', {
  deps: [deferredImportEvaluation],
})
const destructuringPrivate = usePlugin('destructuringPrivate')
const exportDefaultFrom = usePlugin('exportDefaultFrom')
const functionBind = usePlugin('functionBind')
const functionSent = usePlugin('functionSent')
const importSync = usePlugin('importSync')
const moduleBlocks = usePlugin('moduleBlocks')
const namespaceImportFilter = usePlugin('namespaceImportFilter')
const sourcePhaseImports = usePlugin('sourcePhaseImports')
const structs = usePlugin('structs')
const throwExpressions = usePlugin('throwExpressions')
const discardBinding = usePlugin('discardBinding', {
  options: { syntaxType: 'void' },
})
</script>

<template>
  <div flex="~ col" gap2 text-sm font-mono>
    <label>
      <AppSwitch v-model="estree" />
      <span>ESTree</span>
    </label>

    <h3 border-t pt1 text-center font-bold>Options</h3>

    <label>
      <span>sourceType</span>
      <select v-model="sourceType">
        <option value="script">script</option>
        <option value="module">module</option>
        <option value="commonjs">commonjs</option>
        <option value="unambiguous">unambiguous</option>
      </select>
    </label>

    <details>
      <summary cursor-pointer>allow syntaxes...</summary>
      <div flex="~ col gap2 wrap" ml3 mt1 text-xs>
        <label>
          <AppCheckbox v-model="allowImportExportEverywhere" />
          <span>allowImportExportEverywhere</span>
        </label>

        <label>
          <AppCheckbox v-model="allowAwaitOutsideFunction" />
          <span>allowAwaitOutsideFunction</span>
        </label>

        <label>
          <AppCheckbox v-model="allowYieldOutsideFunction" />
          <span>allowYieldOutsideFunction</span>
        </label>

        <label text-xs>
          <AppCheckbox v-model="allowNewTargetOutsideFunction" />
          <span>allowNewTargetOutsideFunction</span>
        </label>

        <label>
          <AppCheckbox v-model="allowReturnOutsideFunction" />
          <span>allowReturnOutsideFunction</span>
        </label>

        <label>
          <AppCheckbox v-model="allowSuperOutsideMethod" />
          <span>allowSuperOutsideMethod</span>
        </label>

        <label>
          <AppCheckbox v-model="allowUndeclaredExports" />
          <span>allowUndeclaredExports</span>
        </label>
      </div>
    </details>

    <details>
      <summary cursor-pointer>create expressions...</summary>
      <div flex="~ col gap2 wrap" ml3 mt1 text-xs>
        <label>
          <AppCheckbox v-model="createImportExpressions" />
          <span>createImportExpressions</span>
        </label>

        <label text-xs>
          <AppCheckbox v-model="createParenthesizedExpressions" />
          <span>createParenthesizedExpressions</span>
        </label>
      </div>
    </details>

    <label>
      <AppSwitch v-model="errorRecovery" />
      <span>errorRecovery</span>
    </label>

    <label>
      <AppSwitch v-model="ranges" />
      <span>ranges</span>
    </label>

    <label>
      <AppSwitch v-model="locations" />
      <span>locations</span>
    </label>

    <label>
      <AppSwitch v-model="tokens" />
      <span>tokens</span>
    </label>

    <label>
      <AppSwitch v-model="attachComment" />
      <span>attachComment</span>
    </label>

    <h3 border-t pt1 text-center font-bold>Languages</h3>

    <label>
      <AppSwitch v-model="typescript.enabled" />
      <span>TypeScript</span>
    </label>

    <label v-if="typescript.enabled" ml6>
      <AppSwitch v-model="typescript.options.dts" />
      <span>dts</span>
    </label>

    <label>
      <AppSwitch v-model="jsx" />
      <span>JSX</span>
    </label>

    <label>
      <AppSwitch v-model="flow" />
      <span>Flow</span>
    </label>

    <label>
      <AppSwitch v-model="v8intrinsic" />
      <span>V8 Intrinsic</span>
    </label>

    <h3 border-t pt1 text-center font-bold>ES Modules</h3>

    <label>
      <!-- Stage 3 -->
      <AppSwitch v-model="sourcePhaseImports" />
      <span>sourcePhaseImports</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <AppSwitch v-model="moduleBlocks" />
      <span>moduleBlocks</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <AppSwitch v-model="deferredImportEvaluation" />
      <span>deferredImportEvaluation</span>
    </label>

    <label ml6>
      <AppSwitch v-model="deferredReexports" />
      <span>deferredReexports</span>
    </label>

    <label>
      <AppSwitch v-model="importSync" />
      <span>importSync</span>
    </label>

    <label>
      <AppSwitch v-model="namespaceImportFilter" />
      <span>namespaceImportFilter</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <AppSwitch v-model="exportDefaultFrom" />
      <span>exportDefaultFrom</span>
    </label>

    <h3 border-t pt1 text-center font-bold>Functions</h3>

    <label>
      <!-- Stage 2 -->
      <AppSwitch v-model="pipelineOperator.enabled" />
      <span>pipelineOperator</span>
    </label>

    <label v-if="pipelineOperator.enabled" ml6>
      <span>proposal</span>
      <select v-model="pipelineOperator.options.proposal">
        <option value="hack">hack</option>
        <option value="fsharp">fsharp</option>
      </select>
    </label>

    <label
      v-if="
        pipelineOperator.enabled && pipelineOperator.options.proposal === 'hack'
      "
      ml6
    >
      <span>topicToken</span>
      <select v-model="pipelineOperator.options.topicToken">
        <option value="%">%</option>
        <option value="#">#</option>
        <option value="^">^</option>
        <option value="@@">@@</option>
        <option value="^^">^^</option>
      </select>
    </label>

    <label>
      <!-- Stage 2 -->
      <AppSwitch v-model="functionSent" />
      <span>functionSent</span>
    </label>

    <label>
      <!-- Stage 0 -->
      <AppSwitch v-model="functionBind" />
      <span>functionBind</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <AppSwitch v-model="partialApplication" />
      <span>partialApplication</span>
    </label>

    <h3 border-t pt1 text-center font-bold>Syntaxes</h3>

    <!-- Stage 2 -->
    <label>
      <AppSwitch v-model="discardBinding" />
      <span>discardBinding</span>
    </label>

    <label>
      <!-- Stage 3 -->
      <AppSwitch v-model="decorators" />
      <span>decorators</span>
    </label>

    <label ml6>
      <AppSwitch v-model="decoratorsLegacy" />
      <span>legacy</span>
    </label>

    <label ml6>
      <AppSwitch v-model="decoratorAutoAccessors" />
      <span>autoAccessors</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <AppSwitch v-model="doExpressions" />
      <span>doExpressions</span>
    </label>

    <label ml6>
      <!-- Stage 1 -->
      <AppSwitch v-model="asyncDoExpressions" />
      <span>async</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <AppSwitch v-model="throwExpressions" />
      <span>throwExpressions</span>
    </label>

    <label>
      <!-- Stage 2 -->
      <AppSwitch v-model="destructuringPrivate" />
      <span>destructuringPrivate</span>
    </label>

    <label>
      <AppSwitch v-model="structs" />
      <span>structs</span>
    </label>

    <label>
      <!-- Stage 1 -->
      <AppSwitch v-model="optionalChainingAssign" />
      <span>optionalChainingAssign</span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
