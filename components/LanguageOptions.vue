<script setup lang="ts">
const dialog = ref<HTMLDialogElement>()
const value = ref(
  rawOptions.value ||
    JSON.stringify(currentLanguage.value.options.defaultValue, null, 2)
)

function openDialog() {
  dialog.value?.showModal()
}

function handleDialogClick(evt: MouseEvent) {
  if (evt.target === evt.currentTarget) dialog.value?.close()
}

watchEffect(() => {
  rawOptions.value = value.value
})
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
        v-model="value"
        w-50vw
        :language="currentLanguage.options.language"
      />
    </dialog>
  </div>
</template>
