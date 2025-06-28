<template>
  <div v-show="expLayout === 'layout2' && !showInputEditor">
    <OutputContainer :index="0" v-show="showOutput" min-w-0 h-full w-full py1 />
  </div>

  <div v-show="!showOutput && showInputEditor">
    <InputContainer min-w-0 h-full w-full py1 />
  </div>

  <SplitPane v-show="expLayout === 'layout2' && showInputEditor && showOutput">
    <template #left>
      <InputContainer min-w-0 h-full w-full py1 />
    </template>
    <template #right>
      <OutputContainer :index="0" v-show="showOutput" min-w-0 h-full w-full py1 />
    </template>
  </SplitPane>

  <SplitPane v-show="expLayout === 'layout1' && !showInputEditor && showOutput">
    <template #left>
      <OutputContainer :index="0" v-show="showOutput" min-w-0 h-full w-full py1 />
    </template>
    <template #right>
      <OutputContainer :index="1" v-show="showOutput" min-w-0 h-full w-full py1 />
    </template>
  </SplitPane>

  <SplitPane v-show="expLayout === 'layout1' && showInputEditor && showOutput" layout="vertical">
    <template #left>
      <InputContainer min-w-0 h-full w-full py1 />
    </template>
    <template #right>
      <SplitPane>
        <template #left>
          <OutputContainer :index="0" v-show="showOutput" h-full w-full py1 />
        </template>
        <template #right>
          <OutputContainer :index="1" v-show="showOutput" h-full w-full py1 />
        </template>
      </SplitPane>
    </template>
  </SplitPane>
</template>