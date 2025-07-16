import { currentParser, currentParserGui } from './parser/parser'

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

export const sideBarAvailable = computed(
  () => currentParser.value.options.configurable && !!currentParserGui.value,
)
