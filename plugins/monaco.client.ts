import type { BuiltInParserName, Plugin } from 'prettier'

export default defineNuxtPlugin(() => {
  const monaco = useMonaco()!

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    allowComments: true,
    enableSchemaRequest: true,
    trailingCommas: 'ignore',
  })

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
  })

  monaco.languages.registerDocumentFormattingEditProvider(
    (
      [
        'javascript',
        'typescript',
        'json',
        'html',
        'css',
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
          case 'html':
            pluginIds = [language]
            if (currentLanguageId.value === 'vue') {
              parser = currentLanguageId.value
              pluginIds.push('estree', 'babel', 'typescript')
            } else {
              parser = language
            }
            break
          default:
            return []
        }

        const [prettier, plugins] = await Promise.all([
          importUrl<typeof import('prettier/standalone')>(
            'https://cdn.jsdelivr.net/npm/prettier/standalone.mjs',
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
      importUrl(
        `https://cdn.jsdelivr.net/npm/prettier/plugins/${plugin}.mjs`,
      ).then((mod) => mod.default),
    ),
  )
}
