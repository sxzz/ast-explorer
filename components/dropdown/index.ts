import { type InjectionKey } from 'vue'

export const dropdownContextKey: InjectionKey<{
  hide: () => void
}> = Symbol('dropdownContextKey')

export { default as Dropdown } from './Dropdown.vue'
export { default as DropdownItem } from './DropdownItem.vue'
