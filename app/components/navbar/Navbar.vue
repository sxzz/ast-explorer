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
  <header flex="~ y-center wrap" relative justify-between gap3 px4 py2.5>
    <!-- Left cluster: brand + selectors -->
    <div
      flex="~ gap5 wrap y-center"
      max-sm="w-full flex-col flex-gap3 items-start"
    >
      <div flex="~ y-center" gap2>
        <AppLogo />
        <h1 class="text-lg font-semibold leading-none tracking-tight">
          AST Explorer
        </h1>
        <span
          class="ml-1 border border-base rounded-full bg-elev px-2 py-0.5 text-[0.6875rem] text-mute font-mono"
        >
          {{ branch === 'release' ? `v${version}` : 'dev' }}
        </span>
      </div>

      <div class="h-5 w-px bg-$c-border max-sm:hidden" />

      <div flex="~ y-center wrap" gap3>
        <NavbarLanguageSelect />
        <span text-mute op50>/</span>
        <ParserSelect />
        <ParserOptions v-if="currentParser.options.configurable" nav-button />
      </div>
    </div>

    <!-- Right cluster: meta + actions -->
    <div flex="~ y-center wrap" gap3 max-sm="flex-col w-full items-start">
      <div flex="~ y-center" gap3 text-sm>
        <span
          class="inline-flex items-center gap-1 rounded-full bg-$c-accent-tint px-2 py-0.5 text-[0.8125rem] text-accent font-mono"
        >
          <span class="i-ri:flashlight-line text-[0.85em]" />
          {{ +parseCost.toFixed(1) }} ms
        </span>
        <a
          flex="~ y-center"
          gap0.5
          text-soft
          font-mono
          transition-colors
          hover:text-base
          :href="
            isUrlVersion
              ? overrideVersion
              : `https://npmx.dev/package/${currentParser.pkgName}`
          "
          target="_blank"
        >
          <span>{{ currentParser.pkgName }}</span>
          <template v-if="displayVersion">
            <span op50>@</span>
            <span
              :class="[
                isUrlVersion && 'text-blue-500 dark:text-blue-400',
                overrideVersion && !isUrlVersion && 'text-accent',
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

      <div flex="~ y-center" gap0.5>
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

        <span class="mx-1 h-4 w-px bg-$c-border" />

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

        <span class="mx-1 h-4 w-px bg-$c-border" />

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
  </header>
</template>
