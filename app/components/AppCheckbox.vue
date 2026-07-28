<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

defineOptions({ inheritAttrs: false })

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <CheckboxRoot v-model="model" class="app-checkbox" v-bind="$attrs">
    <CheckboxIndicator class="app-checkbox-indicator">
      <svg aria-hidden="true" viewBox="0 0 12 12">
        <path d="m2.25 6.1 2.2 2.2 5.3-5.25" />
      </svg>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>

<style>
.app-checkbox {
  display: inline-flex;
  flex: none;
  width: 1em;
  height: 1em;
  padding: 0;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  cursor: pointer;
  color: var(--c-bg-base);
  background: var(--c-bg-elev);
  border: 1px solid var(--c-border-strong);
  border-radius: 0.2em;
  transition:
    background 160ms ease,
    border-color 160ms ease;
}

.app-checkbox[data-state='checked'],
.app-checkbox[data-state='indeterminate'] {
  background: var(--c-accent);
  border-color: var(--c-accent);
}

.app-checkbox-indicator {
  display: inline-flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.app-checkbox-indicator svg {
  width: 0.8em;
  height: 0.8em;
  fill: none;
  stroke: currentcolor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.app-checkbox:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}

.app-checkbox[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
