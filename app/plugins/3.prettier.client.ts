import { currentParser } from '~/state/parser/parser'
import type * as Monaco from 'monaco-editor'
import type { BuiltInParserName, Plugin } from 'prettier'

export default defineNuxtPlugin(async () => {
  const monaco: typeof Monaco = await useMonaco()

  monaco.languages.registerDocumentFormattingEditProvider(
    (
      [
        'javascript',
        'typescript',
        'json',
        'html',
        'css',
        'vue',
        'markdown',
        'yaml',
        'php',
        'python',
      ] satisfies MonacoLanguage[]
    ).map((language) => ({ language, exclusive: true })),
    {
      displayName: 'Prettier',
      async provideDocumentFormattingEdits(model, options) {
        const language = model.getLanguageId()
        const text = model.getValue()
        if (language === 'python') {
          const formatted = await formatWithRuff(text)
          return [{ range: model.getFullModelRange(), text: formatted }]
        }

        let pluginIds: string[] | undefined
        let parser: BuiltInParserName | 'php'
        let customPlugins: Promise<Plugin[]> | undefined
        switch (language) {
          case 'json':
            parser = language
          // break omitted
          case 'javascript':
            pluginIds = ['estree']
            if (['flow', 'hermes'].includes(currentParser.value.id)) {
              pluginIds.push((parser = 'flow'))
            } else {
              pluginIds.push('babel')
              parser ||= 'babel'
            }
            break
          case 'typescript':
            pluginIds = [(parser = language), 'estree']
            break
          case 'css':
            parser = language
            pluginIds = ['postcss']
            break
          case 'vue':
          case 'html':
            pluginIds = ['html']
            parser = language
            if (language === 'vue') {
              pluginIds.push('estree', 'babel', 'typescript')
            }
            break
          case 'markdown':
          case 'yaml':
            parser = language
            pluginIds = [language]
            break
          case 'php': {
            parser = 'php'
            customPlugins = Promise.all([
              importJsdelivr('@prettier/plugin-php', '/+esm'),
              loadPrettierPlugins(['html']),
            ])
            break
          }
          default:
            return []
        }

        const [prettier, plugins] = await Promise.all([
          importJsdelivr<typeof import('prettier/standalone')>(
            `prettier`,
            `/standalone.mjs`,
          ),
          customPlugins || loadPrettierPlugins(pluginIds!),
        ])

        const formatted = await prettier.format(text, {
          parser,
          plugins,
          useTabs: !options.insertSpaces,
          tabWidth: options.tabSize,
          semi: false,
          singleQuote: true,
        })

        return [{ range: model.getFullModelRange(), text: formatted }]
      },
    },
  )
})

function loadPrettierPlugins(plugins: string[]): Promise<Plugin[]> {
  return Promise.all(
    plugins.map((plugin) =>
      resolveDefault(importJsdelivr(`prettier`, `/plugins/${plugin}.mjs`)),
    ),
  )
}

async function formatWithRuff(code: string) {
  const {
    default: init,
    Workspace,
    PositionEncoding,
  } = await importJsdelivr<typeof import('@astral-sh/ruff-wasm-web')>(
    '@astral-sh/ruff-wasm-web',
  )
  await init()

  const workspace = new Workspace({}, PositionEncoding.Utf16)
  return workspace.format(code)
}
