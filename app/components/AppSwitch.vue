<script setup lang="ts" generic="T">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineOptions({ inheritAttrs: false })

const model = defineModel<T>({ required: true })

const emit = defineEmits<{
  change: [value: T]
}>()

function updateModel(value: T) {
  model.value = value
  emit('change', value)
}
</script>

<template>
  <SwitchRoot
    :model-value="model"
    class="app-switch"
    v-bind="$attrs"
    @update:model-value="updateModel"
  >
    <SwitchThumb class="app-switch-thumb" />
  </SwitchRoot>
</template>

<style>
.app-switch {
  display: inline-flex;
  flex: none;
  width: 2rem;
  height: 1.125rem;
  padding: 2px;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  background: var(--c-bg-sunk);
  border: 1px solid var(--c-border-strong);
  border-radius: 999px;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.app-switch-thumb {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  background: #fbf9f3;
  border-radius: 50%;
  box-shadow:
    0 1px 2px rgb(15 17 20 / 24%),
    0 0 0 0.5px rgb(15 17 20 / 8%);
  transform: translateX(0);
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.app-switch[data-state='checked'] {
  background: var(--c-accent);
  border-color: var(--c-accent);
}

.app-switch[data-state='checked'] .app-switch-thumb {
  transform: translateX(0.875rem);
}

.app-switch:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--c-accent-tint);
}

.app-switch[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
