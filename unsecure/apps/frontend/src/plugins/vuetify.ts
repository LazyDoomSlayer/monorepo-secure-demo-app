import { createVuetify } from 'vuetify'

import 'vuetify/styles'
// import { darkColors } from '@/assets/colors'
import { aliases, md } from 'vuetify/iconsets/md'

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {},
      },
    },
  },
})
