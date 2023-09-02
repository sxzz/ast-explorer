<script setup lang="ts">
import { getHighlighter } from 'shikiji'
import { hideEmptyKeys, hideLocationData } from '#imports'

const Error = globalThis.Error

const shiki = await getHighlighter({
  themes: ['vitesse-dark', 'vitesse-light'],
  langs: ['json'],
})

const html = computed(() => {
  return shiki.codeToHtml(
    JSON.stringify(
      ast.value,
      (key: string, value: unknown) => {
        if (hideEmptyKeys.value && value == null) return undefined
        if (
          hideLocationData.value &&
          ['loc', 'start', 'end', ...hideKeys.value].includes(key)
        )
          return undefined
        if (typeof value === 'function') return `function ${value.name}(...)`
        return value
      },
      2
    ),
    {
      lang: 'json',
      theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
    }
  )
})

const hideKeysValue = computed({
  get() {
    return JSON.stringify(hideKeys.value)
  },
  set(val) {
    hideKeys.value = JSON.parse(val)
  },
})
</script>

<template>
  <div flex="~ col gap-2" min-w-0>
    <div flex="~ gap-2">
      <label>
        <input v-model="hideEmptyKeys" type="checkbox" /> Hide empty keys
      </label>
      <label>
        <input v-model="hideLocationData" type="checkbox" /> Hide location data
      </label>
      <label>
        Hide keys:
        <input
          v-model="hideKeysValue"
          type="input"
          border="~ $c-border"
          rounded
          px1
        />
      </label>
    </div>
    <div v-if="error" overflow-scroll text-red>
      <pre v-text="error instanceof Error ? error.stack : error" />
    </div>
    <div v-else overflow-scroll v-html="html" />
  </div>
</template>
