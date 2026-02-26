<script setup lang="ts">
import { parseCost } from '~/state/parser/module'
import {
  currentParser,
  displayVersion,
  isUrlVersion,
  overrideVersion,
} from '~/state/parser/parser'
import { version } from '../../../package.json'

const { branch } = useAppConfig()

const disableOverrideVersion = computed(
  () => currentParser.value.versionOverridable === false,
)

function editVersion() {
  // eslint-disable-next-line no-alert
  const newVersion = prompt(
    'Enter a semver version, tag or URL (e.g. 1.0.0, ^1.2.3, next, https://example.com):',
    displayVersion.value,
  )
  overrideVersion.value = newVersion || undefined
}
</script>

<template>
  <div flex="~ y-center wrap" justify-between gap2 p2>
    <div flex="~ gap4 wrap center" max-sm="w-full flex-col flex-gap2">
      <div mr8 flex gap1>
        <AppLogo />
        <h1 text-lg font-bold>AST Explorer</h1>
        <small>{{ branch === 'release' ? `v${version}` : 'dev' }}</small>
      </div>
      <NavbarLanguageSelect />
      <div flex gap2>
        <ParserSelect />
        <ParserOptions v-if="currentParser.options.configurable" nav-button />
      </div>
    </div>

    <div flex gap3 max-sm="flex-col w-full">
      <div flex="~ center" gap3>
        <span op70>{{ +parseCost.toFixed(1) }} ms</span>
        <a
          text-sm
          font-mono
          op80
          hover:underline
          :href="
            isUrlVersion
              ? overrideVersion
              : `https://npmx.dev/package/${currentParser.pkgName}`
          "
          target="_blank"
        >
          <span>{{ currentParser.pkgName }}</span>
          <template v-if="displayVersion">
            <span>@</span>
            <span
              :class="[
                isUrlVersion && 'text-blue',
                overrideVersion &&
                  !isUrlVersion &&
                  'text-green-700 dark:text-green',
                'max-w50 inline-block truncate align-middle',
              ]"
              >{{ displayVersion }}</span
            >
            <small
              v-if="overrideVersion && overrideVersion !== displayVersion"
              op50
            >
              ({{ overrideVersion }})
            </small>
          </template>
        </a>
      </div>

      <div flex="~ center" gap1>
        <button
          :disabled="disableOverrideVersion"
          :class="disableOverrideVersion && 'cursor-not-allowed op30'"
          title="Change Version"
          nav-button
          @click="editVersion"
        >
          <div i-ri:edit-line />
        </button>
        <a
          v-if="currentParser.link"
          title="Open Documentation"
          :href="currentParser.link"
          target="_blank"
          flex="~ center"
          nav-button
        >
          <div i-ri:book-2-line />
        </a>
        <button
          title="Toggle Side Bar"
          :class="(!showSidebar || !sideBarAvailable) && 'op-40'"
          :disabled="!sideBarAvailable"
          nav-button
          @click="toggleSidebar()"
        >
          <div i-ri:list-settings-line />
        </button>
        <button
          title="Toggle Input Editor"
          :class="!showInputEditor && 'op-40'"
          nav-button
          @click="toggleInputEditor()"
        >
          <div i-ri:code-block />
        </button>
        <button
          title="Toggle Output Result"
          :class="!showOutput && 'op-40'"
          nav-button
          @click="toggleOutput()"
        >
          <div i-ri:node-tree />
        </button>
        <button title="Toggle Dark Mode" nav-button @click="toggleDark">
          <div i-ri:sun-line dark:i-ri:moon-line />
        </button>
        <a
          href="https://github.com/sxzz/ast-explorer"
          target="_blank"
          title="GitHub"
          nav-button
        >
          <div i-ri:github-line />
        </a>
        <a
          href="https://github.com/sponsors/sxzz"
          target="_blank"
          flex="~ center"
          title="Sponsor"
          group
          nav-button
        >
          <div
            i-ri:heart-3-line
            group-hover:i-ri:heart-3-fill
            text-pink-400
            group-hover:text-pink-400
          />
        </a>
      </div>
    </div>
  </div>
</template>
