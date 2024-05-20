<template>
  <Suspense>
    <main flex="~ col" lg:h-screen>
      <AppNavBar border-b />

      <div min-h-0 flex flex-1 flex-col gap2 lg:flex-row>
        <AppSideBar
          v-show="showSideBar"
          overflow-auto
          border-r
          lg:w-75
          lg:flex-none
        />

        <div min-h-95vh min-w-0 flex flex-col gap2 p2 lg:flex-1 lg:flex-row>
          <InputContainer v-show="showLeftLayout" min-w-0 flex-1 />
          <OutputContainer v-show="showRightLayout" min-w-0 flex-1 />
        </div>
      </div>
    </main>

    <template #fallback>
      <div flex="~ center" h-screen gap1 text-3xl font-bold>
        <div i-ri:loader-4-fill animate-spin />
        Loading...
      </div>
    </template>
  </Suspense>
</template>
