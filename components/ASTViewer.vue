<script setup lang="ts">
import { getHighlighter } from 'shikiji'
import { hideEmptyKeys, hideLocationData } from '#imports'

const Error = globalThis.Error

let shiki = await getHighlighter({
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
        <input type="checkbox" v-model="hideEmptyKeys" /> Hide empty keys
      </label>
      <label>
        <input type="checkbox" v-model="hideLocationData" /> Hide location data
      </label>
      <label>
        Hide keys:
        <input
          type="input"
          v-model="hideKeysValue"
          border="~ $c-border"
          px1
          rounded
        />
      </label>
    </div>
    <div v-if="error" text-red overflow-scroll>
      <pre v-text="error instanceof Error ? error.stack : error" />
    </div>
    <div overflow-scroll v-else v-html="html" />
  </div>
</template>
