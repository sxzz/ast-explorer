<script setup lang="ts">
const draft = ref('')
const input = useTemplateRef<HTMLInputElement>('input')

function addKeys(text: string) {
  const keys = text
    .split(',')
    .map((key) => key.trim())
    .filter((key) => key && !hideKeys.value.includes(key))
  if (keys.length) hideKeys.value = [...hideKeys.value, ...new Set(keys)]
}

function commit() {
  addKeys(draft.value)
  draft.value = ''
}

function removeKey(key: string) {
  hideKeys.value = hideKeys.value.filter((k) => k !== key)
}

function onInput() {
  // typing or pasting `a, b, c` turns each finished key into a chip
  const lastComma = draft.value.lastIndexOf(',')
  if (lastComma === -1) return
  addKeys(draft.value.slice(0, lastComma))
  draft.value = draft.value.slice(lastComma + 1).trimStart()
}

function onBackspace() {
  if (!draft.value) hideKeys.value = hideKeys.value.slice(0, -1)
}
</script>

<template>
  <div class="hide-keys" @click="input?.focus()">
    <AppTooltip text="Hidden keys">
      <div i-ri:eye-off-line shrink-0 text-mute />
    </AppTooltip>
    <span v-for="key of hideKeys" :key class="hide-keys-chip">
      {{ key }}
      <button
        :aria-label="`Show ${key}`"
        class="hide-keys-remove"
        @click.stop="removeKey(key)"
      >
        <div i-ri:close-line />
      </button>
    </span>
    <input
      ref="input"
      v-model="draft"
      aria-label="Hide keys"
      :placeholder="hideKeys.length ? '' : 'Hide keys, e.g. parent, tokens'"
      @input="onInput"
      @keydown.enter.prevent="commit"
      @keydown.backspace="onBackspace"
      @blur="commit"
    />
  </div>
</template>

<style scoped>
.hide-keys {
  --at-apply: 'flex flex-wrap items-center gap1 min-h-7 cursor-text rounded-md border border-base px1.5 py0.5 font-mono text-xs';
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}
.hide-keys:focus-within {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px var(--c-accent-tint);
}
.hide-keys input {
  --at-apply: 'min-w-20 flex-1 border-none p0 text-sm text-base';
  box-shadow: none;
}
.hide-keys-chip {
  --at-apply: 'inline-flex items-center gap0.5 rounded bg-sunk py0.5 pl1.5 pr0.5 text-soft';
}
.hide-keys-remove {
  --at-apply: 'inline-flex rounded text-mute hover:text-base hover:bg-$c-border';
}
</style>
