<template>
  <div style="height: calc(100vh - 50px)">
    <div
      v-show="editorLayout === 'left-right' && !showInputEditor"
      h-full
      w-full
    >
      <OutputContainer
        v-show="showOutput"
        :index="0"
        h-full
        min-w-0
        w-full
        py1
      />
    </div>

    <div v-show="!showOutput && showInputEditor" h-full w-full>
      <InputContainer h-full min-w-0 w-full py1 />
    </div>

    <SplitPane
      v-show="editorLayout === 'left-right' && showInputEditor && showOutput"
    >
      <template #left>
        <InputContainer h-full min-w-0 w-full py1 />
      </template>
      <template #right>
        <OutputContainer
          v-show="showOutput"
          :index="0"
          h-full
          min-w-0
          w-full
          py1
        />
      </template>
    </SplitPane>

    <SplitPane
      v-show="
        editorLayout === 'top-bottom-split' && !showInputEditor && showOutput
      "
    >
      <template #left>
        <OutputContainer
          v-show="showOutput"
          :index="0"
          h-full
          min-w-0
          w-full
          py1
        />
      </template>
      <template #right>
        <OutputContainer
          v-show="showOutput"
          :index="1"
          h-full
          min-w-0
          w-full
          py1
        />
      </template>
    </SplitPane>

    <SplitPane
      v-show="
        editorLayout === 'top-bottom-split' && showInputEditor && showOutput
      "
      layout="vertical"
    >
      <template #left>
        <InputContainer h-full min-w-0 w-full py1 />
      </template>
      <template #right>
        <SplitPane>
          <template #left>
            <OutputContainer v-show="showOutput" :index="0" h-full w-full py1 />
          </template>
          <template #right>
            <OutputContainer v-show="showOutput" :index="1" h-full w-full py1 />
          </template>
        </SplitPane>
      </template>
    </SplitPane>
  </div>
</template>
