<script setup lang="ts">
import json5 from 'json5'

const raw = ref(JSON.stringify(editorSettings.value, null, 2))
const dialog = useTemplateRef('dialog')

watchEffect(() => {
  let parsed: EditorSettings
  try {
    parsed = json5.parse(raw.value)
  } catch {
    return
  }
  editorSettings.value = parsed
})

watchEffect(() => {
  if (showEditorSettings.value) openDialog()
})

function openDialog() {
  dialog.value?.showModal()
}

function handleDialogClick(evt: MouseEvent) {
  if (evt.target === evt.currentTarget) closeDialog()
}

function closeDialog() {
  dialog.value?.close()
  showEditorSettings.value = false
}
</script>

<template>
  <dialog
    v-if="showEditorSettings"
    ref="dialog"
    h-100
    w-200
    flex="~ col"
    border
    rounded-2xl
    backdrop:bg-black:30
    backdrop:backdrop-blur-2
    @click="handleDialogClick"
    @close="closeDialog"
  >
    <div flex="~ center" relative gap2 py2 font-bold>
      <span text-lg font-bold>Editor Settings</span>
      <a
        title="Reference Documentation"
        href="https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html"
        target="_blank"
        nav-button
      >
        <div i-ri:book-2-line />
      </a>

      <button absolute right-2 nav-button @click="dialog?.close()">
        <div i-ri:close-line />
      </button>
    </div>
    <div flex-1>
      <CodeEditor v-model="raw" language="json" h-full w-full />
    </div>
  </dialog>
</template>
