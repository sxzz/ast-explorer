import { currentParsers, currentParsersGuis } from './parser/parser'

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

export const outputViews = useLocalStorage<['tree' | 'json', 'tree' | 'json']>(
  `${STORAGE_PREFIX}output-view`,
  ['tree', 'tree'],
)

export const sideBarAvailable = computed(() =>
  currentParsers.value.some(
    (parser, idx) =>
      parser.options.configurable && !!currentParsersGuis.value[idx],
  ),
)

export const activeTab = ref<string>('')
