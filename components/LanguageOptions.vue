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
  <div flex justify-center items-center>
    <button class="i-ri:settings-line" @click="openDialog" />
    <dialog ref="dialog" rounded h-50vh p0 @click="handleDialogClick">
      <div text-center text-lg py2 font-bold>
        Parser Options
        <button
          class="i-ri:close-line"
          p4
          float-right
          @click="dialog?.close()"
        />
      </div>
      <CodeEditor
        w-50vw
        v-model="value"
        :language="currentLanguage.options.language"
      />
    </dialog>
  </div>
</template>
