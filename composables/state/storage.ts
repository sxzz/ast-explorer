const PREFIX = 'ast-explorer:'

export const showLeftLayout = useLocalStorage(`${PREFIX}show-left-layout`, true)
export const showRightLayout = useLocalStorage(
  `${PREFIX}show-right-layout`,
  true,
)
export const toggleLeftLayout = useToggle(showLeftLayout)
export const toggleRightLayout = useToggle(showRightLayout)

export const hideEmptyKeys = useLocalStorage(`${PREFIX}hide-empty-keys`, true)
export const hideLocationData = useLocalStorage(
  `${PREFIX}hide-location-data`,
  false,
)
export const hideKeys = useLocalStorage<string[]>(`${PREFIX}hide-keys`, [])
export const autoFocus = useLocalStorage<boolean>(`${PREFIX}auto-focus`, true)
