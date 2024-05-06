import { umTrackView } from '#imports'

export default defineNuxtPlugin({
  name: 'umami',
  hooks: {
    'app:mounted': function () {
      umTrackView()
    },
  },
})
