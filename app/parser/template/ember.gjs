import Component from '@glimmer/component';

const Wrapper = <template>
  <fieldset>
    <legend>{{@name}}</legend>

    {{yield}}
  </fieldset>
</template>;

class Counter extends Component {
  @tracked count = 0;

  increment = () => this.count++;

  <template>
    <output>{{this.count}}</output>

    <button {{on "click" this.increment}}>++</button>
  </template>
}

<template>
  <Wrapper @name="counter">
    <Counter />
  </Wrapper>
</template>
