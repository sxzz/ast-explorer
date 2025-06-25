import type { Layout } from '~/types'
import { currentParsers, currentParsersGui } from './parser/parser'

export const showSidebar = useLocalStorage(
  `${STORAGE_PREFIX}show-sidebar`,
  true,
)
export const showInputEditor = useLocalStorage(
  `${STORAGE_PREFIX}show-input-editor`,
  true,
)
export const showOutput = useLocalStorage(`${STORAGE_PREFIX}show-output`, true)
export const toggleSidebar = useToggle(showSidebar)
export const toggleInputEditor = useToggle(showInputEditor)
export const toggleOutput = useToggle(showOutput)

export const outputView = useLocalStorage<'tree' | 'json'>(
  `${STORAGE_PREFIX}output-view`,
  'tree',
)

export const expLayout = ref<Layout>('layout1')

export const sideBarAvailable = computed(
  () => currentParsers.value.some(parser => parser.options.configurable) 
  // () => currentParsers.value.some(parser => parser.options.configurable && !!currentParsersGui.value) 
)
