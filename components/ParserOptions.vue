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
    <dialog ref="dialog" h-50vh rounded p0 @click="handleDialogClick">
      <div py2 text-center text-lg font-bold>
        Parser Options
        <button
          class="i-ri:close-line"
          float-right
          p4
          @click="dialog?.close()"
        />
      </div>
      <CodeEditor
        v-model="rawOptions"
        w-50vw
        :language="currentParser.options.editorLanguage"
      />
    </dialog>
  </div>
</template>
