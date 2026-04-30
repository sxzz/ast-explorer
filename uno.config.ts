import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind3,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'border-base': 'border-$c-border',
    'border-strong': 'border-$c-border-strong',
    'border-bg-base': 'border-$c-bg-base',
    'bg-base': 'bg-$c-bg-base',
    'bg-elev': 'bg-$c-bg-elev',
    'bg-sunk': 'bg-$c-bg-sunk',
    'text-base': 'text-$c-text-base',
    'text-soft': 'text-$c-text-soft',
    'text-mute': 'text-$c-text-mute',
    'text-accent': 'text-$c-accent',
    'flex-center': 'items-center justify-center',
    'flex-x-center': 'justify-center',
    'flex-y-center': 'items-center',
    'nav-button':
      'inline-flex flex-center rounded-lg p1.5 text-soft hover:text-base hover:bg-$c-bg-sunk transition-colors duration-150 ease-out',
    'pill-button':
      'inline-flex flex-center gap1 rounded-full border border-base bg-elev px2.5 py1 text-xs text-soft hover:text-base hover:border-strong transition duration-150',
  },
  theme: {
    fontFamily: {
      sans: 'var(--f-sans)',
      mono: 'var(--f-mono)',
    },
    colors: {
      accent: 'var(--c-accent)',
      'accent-soft': 'var(--c-accent-soft)',
    },
  },
  presets: [
    presetWind3({
      attributifyPseudo: true,
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        color: 'inherit',
        // Avoid crushing of icons in crowded situations
        'min-width': '1.2em',
      },
    }),
  ],
  transformers: [transformerDirectives()],
})
