import themeDark from 'shiki/themes/dark-plus.mjs'
import themeLight from 'shiki/themes/light-plus.mjs'
import type * as monaco from 'monaco-editor'

export function getSharedMonacoOptions(): monaco.editor.IStandaloneEditorConstructionOptions {
  return {
    automaticLayout: true,
    theme: isDark.value ? themeDark.name! : themeLight.name!,
    fontFamily:
      '"Cascadia Code", "Jetbrains Mono", "Fira Code", "Menlo", "Consolas", monospace',
    tabSize: 2,
    minimap: {
      enabled: false,
    },
  }
}
