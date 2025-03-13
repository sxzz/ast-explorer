import themeDark from 'shiki/themes/dark-plus.mjs'
import themeLight from 'shiki/themes/light-plus.mjs'
import type { Range } from '#imports'
import type * as monaco from 'monaco-editor'

export const code = ref('')
export const editorCursor = ref<number>(0)
export const outputHoverRange = ref<Range | undefined>()
export const showEditorSettings = ref(false)

export type EditorSettings = monaco.editor.IEditorOptions &
  monaco.editor.IGlobalEditorOptions
export const editorSettings = useLocalStorage<EditorSettings>(
  `${STORAGE_PREFIX}editor-settings`,
  {
    fontFamily:
      '"Cascadia Code", "Jetbrains Mono", "Fira Code", "Menlo", "Consolas", monospace',
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'off',
    minimap: { enabled: false },
  },
)

export function getSharedMonacoOptions(): EditorSettings {
  return {
    automaticLayout: true,
    theme: isDark.value ? themeDark.name! : themeLight.name!,
    ...editorSettings.value,
  }
}
