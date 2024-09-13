import type { BuiltInParserName, Plugin } from 'prettier'

export default defineNuxtPlugin(() => {
  const monaco = useMonaco()!

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
      ] satisfies MonacoLanguage[]
    ).map((language) => ({ language, exclusive: true })),
    {
      displayName: 'Prettier',
      async provideDocumentFormattingEdits(model, options) {
        const language = model.getLanguageId()
        const text = model.getValue()

        let pluginIds: string[]
        let parser: BuiltInParserName
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
            parser = language
            pluginIds = [language]
            break
          default:
            return []
        }

        const [prettier, plugins] = await Promise.all([
          importJsdelivr<typeof import('prettier/standalone')>(
            `prettier`,
            `/standalone.mjs`,
          ),
          loadPrettierPlugins(pluginIds),
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
      importJsdelivr(`prettier`, `/plugins/${plugin}.mjs`).then(
        (mod) => mod.default,
      ),
    ),
  )
}
