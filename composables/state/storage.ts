const PREFIX = 'ast-explorer:'

export const showSidebar = useLocalStorage(`${PREFIX}show-sidebar`, true)
export const showInputEditor = useLocalStorage(
  `${PREFIX}show-input-editor`,
  true,
)
export const showOutput = useLocalStorage(`${PREFIX}show-output`, true)
export const toggleSidebar = useToggle(showSidebar)
export const toggleInputEditor = useToggle(showInputEditor)
export const toggleOutput = useToggle(showOutput)

export const hideEmptyKeys = useLocalStorage(`${PREFIX}hide-empty-keys`, true)
export const hideLocationData = useLocalStorage(
  `${PREFIX}hide-location-data`,
  false,
)
export const hideKeys = useLocalStorage<string[]>(`${PREFIX}hide-keys`, [])
export const autoFocus = useLocalStorage<boolean>(`${PREFIX}auto-focus`, true)

export const outputView = useLocalStorage<'tree' | 'json'>(
  `${PREFIX}output-view`,
  'tree',
)
