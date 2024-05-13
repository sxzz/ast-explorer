import { umTrackView } from '#imports'

export default defineNuxtPlugin({
  name: 'umami',
  hooks: {
    'app:mounted': () => {
      if (import.meta.env.PROD) umTrackView()
    },
  },
})
