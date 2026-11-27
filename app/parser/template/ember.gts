import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { TOC } from '@ember/component/template-only';

interface WrapperSignature {
  Args: { name: string };
  Blocks: { default: [] };
}

const Wrapper: TOC<WrapperSignature> = <template>
  <fieldset>
    <legend>{{@name}}</legend>

    {{yield}}
  </fieldset>
</template>;

class Counter extends Component {
  @tracked count: number = 0;

  increment = (): void => {
    this.count++;
  };

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
