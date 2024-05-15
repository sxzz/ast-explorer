<script setup lang="ts">
import { rawOptions } from '#imports'

const dialog = ref<HTMLDialogElement>()

function openDialog() {
  dialog.value?.showModal()
}

function handleDialogClick(evt: MouseEvent) {
  if (evt.target === evt.currentTarget) dialog.value?.close()
}
</script>

<template>
  <div flex items-center justify-center>
    <button class="i-ri:settings-line" @click="openDialog" />
    <dialog
      ref="dialog"
      h-80vh
      border="~ base"
      rounded
      p0
      @click="handleDialogClick"
    >
      <div relative flex items-center justify-center gap1 py2 text-lg font-bold>
        Parser Options
        <button
          class="i-ri:close-line"
          absolute
          right-1
          p4
          @click="dialog?.close()"
        />
      </div>
      <CodeEditor
        v-model="rawOptions"
        h-full
        w-60vw
        :language="currentParser.options.editorLanguage"
      />
    </dialog>
  </div>
</template>
