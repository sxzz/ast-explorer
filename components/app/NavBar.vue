<script setup lang="ts">
import { version } from '~/package.json'

const { branch } = useAppConfig()

const disableOverrideVersion = computed(
  () => currentParser.value.versionOverridable === false,
)

function editVersion() {
  // eslint-disable-next-line no-alert
  const newVersion = prompt(
    'Enter a semver version or tag (e.g. 1.0.0, ^1.2.3, next):',
    displayVersion.value,
  )
  overrideVersion.value = newVersion || undefined
}
</script>

<template>
  <div flex="~ y-center wrap" justify-between gap2 p2>
    <div flex="~ gap4 wrap" max-sm:flex-col>
      <div flex gap1>
        <AppLogo />
        <h1 text-lg font-bold>AST Explorer</h1>
        <small>{{ branch === 'release' ? `v${version}` : 'dev' }}</small>
      </div>
      <LanguageSelect />
      <div flex gap2>
        <ParserSelect />
        <ParserOptions v-if="currentParser.options.configurable" />
      </div>
    </div>

    <div flex gap3 max-sm:flex-col>
      <div flex gap3>
        <span op80>{{ +parseCost.toFixed(1) }} ms</span>
        <a
          font-mono
          op80
          hover:underline
          :href="`https://www.npmjs.com/package/${currentParser.pkgName}`"
          target="_blank"
        >
          <span>{{ currentParser.pkgName }}</span>
          <template v-if="displayVersion">
            <span>@</span>
            <span :class="{ 'text-red': overrideVersion }">{{
              displayVersion
            }}</span>
            <small
              v-if="overrideVersion && overrideVersion !== displayVersion"
              op50
            >
              ({{ overrideVersion }})
            </small>
          </template>
        </a>
      </div>

      <div flex gap3>
        <button
          :disabled="disableOverrideVersion"
          :class="{ 'cursor-not-allowed op30': disableOverrideVersion }"
          title="Change Version"
          @click="editVersion"
        >
          <div i-ri:edit-line />
        </button>
        <a :href="currentParser.link" target="_blank" flex="~ center">
          <div i-ri:book-2-line />
        </a>
        <button title="Toggle Left Layout" @click="toggleLeftLayout">
          <div v-if="showLeftLayout" i-ri:layout-column-fill />
          <div v-else i-ri:layout-left-line />
        </button>
        <button title="Toggle Right Layout" @click="toggleRightLayout">
          <div v-if="showRightLayout" i-ri:layout-column-fill rotate-180 />
          <div v-else i-ri:layout-left-line rotate-180 />
        </button>
        <button @click="toggleDark">
          <div i-ri:sun-line dark:i-ri:moon-line />
        </button>
        <a
          href="https://github.com/sxzz/ast-explorer"
          target="_blank"
          flex="~ center"
        >
          <div i-ri:github-line />
        </a>
      </div>
    </div>
  </div>
</template>
