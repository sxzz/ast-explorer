import type * as monaco from 'monaco-editor'

export function getSharedMonacoOptions(): monaco.editor.IStandaloneEditorConstructionOptions {
  return {
    automaticLayout: true,
    theme: isDark.value ? 'vs-dark' : 'vs',
    fontFamily:
      '"Cascadia Code", "Jetbrains Mono", "Fira Code", "Menlo", "Consolas", monospace',
    tabSize: 2,
    minimap: {
      enabled: false,
    },
  }
}
