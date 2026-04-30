import themeDarkRaw from 'shiki/themes/vitesse-dark.mjs'
import themeLightRaw from 'shiki/themes/vitesse-light.mjs'

const PALETTE = {
  light: {
    bg: '#f7f4ec',
    bgElev: '#fbf9f3',
    bgSunk: '#efeadd',
    border: '#e3dccb',
    text: '#1a1a17',
    textMute: '#7a7972',
  },
  dark: {
    bg: '#0f1114',
    bgElev: '#15181c',
    bgSunk: '#0a0c0e',
    border: '#25292f',
    text: '#ece8dd',
    textMute: '#75726a',
  },
} as const

function tintTheme<T extends typeof themeLightRaw>(
  theme: T,
  p: (typeof PALETTE)[keyof typeof PALETTE],
): T {
  return {
    ...theme,
    bg: p.bg,
    fg: p.text,
    colors: {
      ...theme.colors,
      'editor.background': p.bg,
      'editor.foreground': p.text,
      'editorGutter.background': p.bg,
      'editor.lineHighlightBackground': p.bgElev,
      'editor.lineHighlightBorder': p.bg,
      'editorLineNumber.foreground': p.textMute,
      'editorLineNumber.activeForeground': p.text,
      'editorIndentGuide.background1': p.border,
      'editorIndentGuide.activeBackground1': p.border,
      'editorWidget.background': p.bgElev,
      'editorWidget.border': p.border,
      'editorSuggestWidget.background': p.bgElev,
      'editorSuggestWidget.border': p.border,
      'editorHoverWidget.background': p.bgElev,
      'editorHoverWidget.border': p.border,
      'scrollbarSlider.background': `${p.border}aa`,
      'scrollbarSlider.hoverBackground': `${p.border}cc`,
      'scrollbarSlider.activeBackground': `${p.border}ee`,
    },
  }
}

export const themeLight = tintTheme(themeLightRaw, PALETTE.light)
export const themeDark = tintTheme(themeDarkRaw, PALETTE.dark)
