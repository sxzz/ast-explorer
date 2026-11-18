import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'
import { shikiTheme } from '~/composables/shiki'
import { STORAGE_PREFIX } from '~/state/constants'
import type * as monaco from 'monaco-editor'
import type { Range } from '~/composables/location'

export const code = ref('')
export const editorCursor = ref<number>(0)
export const outputHoverRange = ref<Range | undefined>()
export const showEditorSettings = ref(false)
export const showAstTreeStyles = ref(false)

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

export const astTreeStyles = useLocalStorage<Record<string, any>>(
  `${STORAGE_PREFIX}ast-tree-styles`,
  {},
)

export function getSharedMonacoOptions(): EditorSettings {
  return {
    automaticLayout: true,
    theme: shikiTheme.value,
    ...editorSettings.value,
  }
}
