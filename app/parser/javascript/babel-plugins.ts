import {
  computed,
  reactive,
  watch,
  type Reactive,
  type Ref,
  type WritableComputedRef,
} from 'vue'
import { useOptions } from '~/state/parser/options'
import type { ParserOptions, ParserPlugin } from '@babel/parser'

type PluginName = Extract<ParserPlugin, string>
type PluginNameWithOptions = Extract<ParserPlugin, any[]>[0]
type PluginOptions<N extends PluginNameWithOptions> = Extract<
  ParserPlugin,
  [N, any]
>[1]

function getPluginName(plugin: ParserPlugin): PluginName {
  return Array.isArray(plugin) ? plugin[0] : plugin
}

function getPlugins(opt: ParserOptions | undefined): ParserPlugin[] {
  return Array.isArray(opt?.plugins) ? opt.plugins : []
}

function findPlugin(opt: ParserOptions | undefined, name: PluginName) {
  return getPlugins(opt).find((plugin) => getPluginName(plugin) === name)
}

function hasPlugin(opt: ParserOptions | undefined, ...names: PluginName[]) {
  return getPlugins(opt).some((plugin) => names.includes(getPluginName(plugin)))
}

function removePlugins(opt: ParserOptions, ...names: PluginName[]) {
  opt.plugins = getPlugins(opt).filter(
    (plugin) => !names.includes(getPluginName(plugin)),
  )
}

/** Replaces the plugin in place, so the order of `plugins` stays stable. */
function setPlugin(opt: ParserOptions, plugin: ParserPlugin) {
  const name = getPluginName(plugin)
  const plugins = getPlugins(opt)
  opt.plugins = hasPlugin(opt, name)
    ? plugins.map((p) => (getPluginName(p) === name ? plugin : p))
    : [...plugins, plugin]
}

export interface UsePluginOptions<N extends PluginName> {
  /** Written as `[name, options]` when the plugin is enabled. */
  options?: N extends PluginNameWithOptions ? PluginOptions<N> : never
  /**
   * Plugins this one requires: enabling it enables them,
   * and disabling any of them disables it.
   */
  deps?: Ref<boolean>[]
}

/** A switch for whether `name` is in `plugins`. */
export function usePlugin<N extends PluginName>(
  name: N,
  { options, deps = [] }: UsePluginOptions<N> = {},
): WritableComputedRef<boolean> {
  const plugin = useOptions(
    (opt?: ParserOptions) => hasPlugin(opt, name),
    (enabled: boolean, opt) => {
      if (!enabled) removePlugins(opt, name)
      else if (!hasPlugin(opt, name))
        setPlugin(opt, options ? ([name, options] as ParserPlugin) : name)
    },
  )

  if (deps.length) {
    watch(
      () => deps.every((dep) => dep.value),
      (satisfied) => {
        if (!satisfied && plugin.value) plugin.value = false
      },
      // Sync, so the dependent is removed in the same write as its dep: Babel
      // never sees the invalid combination, and storage persists the result.
      { flush: 'sync' },
    )
  }

  return computed({
    get: () => plugin.value,
    set(enabled) {
      // Go through the deps' own refs so their options and deps apply too.
      if (enabled) for (const dep of deps) if (!dep.value) dep.value = true
      plugin.value = enabled
    },
  })
}

export type PluginState<
  N extends PluginNameWithOptions,
  K extends keyof PluginOptions<N>,
> = Reactive<{
  enabled: WritableComputedRef<boolean>
  options: { [P in K]: WritableComputedRef<Required<PluginOptions<N>>[P]> }
}>

/**
 * A plugin with editable options. Every key of `defaultOptions` becomes a
 * writable field of `options`, so it can be bound with `v-model` directly.
 */
export function usePluginWithOptions<
  N extends PluginNameWithOptions,
  K extends keyof PluginOptions<N>,
>(
  name: N,
  defaultOptions: Pick<Required<PluginOptions<N>>, K>,
  deps?: Ref<boolean>[],
): PluginState<N, K> {
  const getOptions = (opt?: ParserOptions): PluginOptions<N> => {
    const plugin = findPlugin(opt, name)
    return {
      ...defaultOptions,
      ...(Array.isArray(plugin) ? plugin[1] : undefined),
    }
  }

  const options = Object.fromEntries(
    (Object.keys(defaultOptions) as K[]).map((key) => [
      key,
      useOptions(
        (opt?: ParserOptions) => getOptions(opt)[key],
        (value, opt) =>
          setPlugin(opt, [
            name,
            { ...getOptions(opt), [key]: value },
          ] as ParserPlugin),
      ),
    ]),
  ) as PluginState<N, K>['options']

  return reactive({
    enabled: usePlugin(name, { options: defaultOptions as any, deps }),
    options,
  }) as PluginState<N, K>
}

/**
 * `decorators` and `decorators-legacy` are mutually exclusive, so they are
 * exposed as one switch plus a "legacy" flavor.
 */
export function useDecorators() {
  const decorators = useOptions(
    (opt?: ParserOptions) => hasPlugin(opt, 'decorators', 'decorators-legacy'),
    (enabled: boolean, opt) => {
      if (enabled) {
        if (!hasPlugin(opt, 'decorators', 'decorators-legacy'))
          setPlugin(opt, 'decorators')
      } else {
        removePlugins(opt, 'decorators', 'decorators-legacy')
      }
    },
  )
  const legacy = useOptions(
    (opt?: ParserOptions) => hasPlugin(opt, 'decorators-legacy'),
    (legacy: boolean, opt) => {
      removePlugins(opt, 'decorators', 'decorators-legacy')
      setPlugin(opt, legacy ? 'decorators-legacy' : 'decorators')
    },
  )
  return { decorators, legacy }
}
