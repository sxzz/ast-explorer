<script lang="ts">
import { useOptions } from '~/state/parser/options'
import type {
  ParserOptions,
  ParserPlugin,
  ParserPluginWithOptions,
} from '@babel/parser'
import { babel } from './babel'

function isPluginOf(plugin: ParserPlugin, name: ParserPlugin & string) {
  return plugin === name || (Array.isArray(plugin) && plugin[0] === name)
}

type ExtractPluginOptions<T extends ParserPlugin & string> = Extract<
  ParserPluginWithOptions,
  [T, any]
>[1]

function getPluginOptions<T extends ParserPlugin & string>(
  plugins: ParserPlugin[] | undefined,
  name: T,
): boolean | ExtractPluginOptions<T> {
  const plugin = plugins?.find((p) => isPluginOf(p, name))
  if (!plugin) return false
  return Array.isArray(plugin) ? plugin[1] : true
}

function usePlugin<T extends ParserPlugin & string>(
  name: T,
  options: {
    defaultOptions: ExtractPluginOptions<T>
    deps?: Ref<boolean | undefined>[]
  },
): WritableComputedRef<
  ExtractPluginOptions<T>,
  ExtractPluginOptions<T> | boolean
>
function usePlugin<T extends ParserPlugin & string>(
  name: T,
  options?: { deps?: Ref<boolean | undefined>[] },
): WritableComputedRef<boolean>
function usePlugin<T extends ParserPlugin & string>(
  name: T,
  {
    defaultOptions,
    deps = [],
  }: {
    defaultOptions?: ExtractPluginOptions<T>
    deps?: Ref<boolean | undefined>[]
  } = {},
): WritableComputedRef<boolean | ExtractPluginOptions<T>> {
  const options = ref<any>({ ...defaultOptions })

  const value = useOptions(
    (opt?: ParserOptions) => {
      const pluginOptions = getPluginOptions(opt?.plugins, name)
      if (pluginOptions && defaultOptions) {
        options.value =
          pluginOptions === true ? { ...defaultOptions } : pluginOptions
        return options.value
      } else {
        return pluginOptions
      }
    },
    (value, opt) => {
      if (!Array.isArray(opt.plugins)) {
        opt.plugins = []
      } else {
        opt.plugins = opt.plugins.filter((p) => !isPluginOf(p, name))
      }

      if (value !== false && value != null) {
        deps.forEach((dep) => !dep.value && (dep.value = true))
        if (value === true && defaultOptions) {
          value = defaultOptions
        }
        opt.plugins.push(value === true ? name : ([name, value] as any))
      }
    },
    babel.id
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
const useOption = makeUseOption(babel.id)
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
const typescript = usePlugin('typescript', {
  defaultOptions: {
    dts: false,
  },
})
const typescriptEnable = computed({
  get: () => !!typescript.value,
  set: (value) => (typescript.value = value),
})
function triggerTypescript() {
  typescript.value = { ...typescript.value }
}

const jsx = usePlugin('jsx')
const flow = usePlugin('flow')
const v8intrinsic = usePlugin('v8intrinsic')

// proposals
const doExpressions = usePlugin('doExpressions')
const asyncDoExpressions = usePlugin('asyncDoExpressions', {
  deps: [doExpressions],
})

const decorators = useOptions(
  (opt?: ParserOptions) =>
    opt?.plugins?.some(
      (p) => isPluginOf(p, 'decorators') || isPluginOf(p, 'decorators-legacy'),
    ),
  (value, opt) => {
    if (!Array.isArray(opt.plugins)) opt.plugins = []
    if (value) {
      opt.plugins.push('decorators')
    } else {
      opt.plugins = del(opt.plugins, ['decorators', 'decorators-legacy'])
    }
  },
  babel.id
)
const decoratorsLegacy = useOptions(
  (opt?: ParserOptions) =>
    opt?.plugins?.some((p) => isPluginOf(p, 'decorators-legacy')),
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
  babel.id
)

const optionalChainingAssign = usePlugin('optionalChainingAssign', {
  defaultOptions: {
    version: '2023-07',
  },
})

const pipelineOperator = usePlugin('pipelineOperator', {
  defaultOptions: {
    proposal: 'hack',
    topicToken: '%',
  },
})
const pipelineOperatorEnable = computed({
  get: () => !!pipelineOperator.value,
  set: (value) => (pipelineOperator.value = value),
})

function triggerPipelineOperator() {
  pipelineOperator.value = { ...pipelineOperator.value }
}

const decoratorAutoAccessors = usePlugin('decoratorAutoAccessors', {
  deps: [decorators],
})
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
const partialApplication = usePlugin('partialApplication')
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

        <label>
          <input v-model="allowYieldOutsideFunction" type="checkbox" />
          <span>allowYieldOutsideFunction</span>
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
      <input v-model="typescriptEnable" type="checkbox" switch />
      <span>TypeScript</span>
    </label>

    <label v-if="typescript" ml6>
      <input v-model="typescript.dts" type="checkbox" switch @change="triggerTypescript" />
      <span>dts</span>
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

    <label>
      <input v-model="importReflection" type="checkbox" switch />
      <span>
        <span line-through>importReflection</span>
        (deprecated)
      </span>
    </label>

    <h3 border-t pt1 text-center font-bold>Functions</h3>

    <label>
      <!-- Stage 2 -->
      <input v-model="pipelineOperatorEnable" type="checkbox" switch />
      <span>pipelineOperator</span>
    </label>

    <label v-if="pipelineOperator" ml6>
      <span>proposal</span>
      <select v-model="pipelineOperator.proposal" @change="triggerPipelineOperator">
        <option value="hack">hack</option>
        <option value="fsharp">fsharp</option>
      </select>
    </label>

    <label v-if="pipelineOperator && pipelineOperator.proposal === 'hack'" ml6>
      <span>topicToken</span>
      <select v-model="pipelineOperator.topicToken" @change="triggerPipelineOperator">
        <option value="%">%</option>
        <option value="#">#</option>
        <option value="^">^</option>
        <option value="@@">@@</option>
        <option value="^^">^^</option>
      </select>
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
      <span>
        <span line-through>recordAndTuple</span>
        (withdrawn)
      </span>
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
      <span>
        <span line-through>decimal</span>
        (deprecated)
      </span>
    </label>
  </div>
</template>

<style scoped>
label {
  --at-apply: 'flex flex-y-center gap2';
}
</style>
