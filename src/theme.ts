import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const ink = {
  50: '#f4f4f1', 100: '#e4e4de', 200: '#cfcfc8', 300: '#a8a8a0', 400: '#80807a',
  500: '#56564f', 600: '#3d3d38', 700: '#2e2e29', 800: '#1c1c19', 900: '#0e0e0d', 950: '#070706',
}

export const preset = definePreset(Aura, {
  primitive: { borderRadius: { none: '0', xs: '1px', sm: '1px', md: '1px', lg: '1px', xl: '2px' } },
  semantic: {
    primary: ink,
    focusRing: { width: '2px', style: 'solid', color: '#0e0e0d', offset: '3px' },
    colorScheme: {
      light: {
        primary: { color: '#0e0e0d', contrastColor: '#fbfbf9', hoverColor: '#2e2e29', activeColor: '#0e0e0d' },
        surface: { 0: '#fbfbf9', 50: '#f7f7f5', 100: '#f2f2ee', 200: '#e4e4de', 300: '#cfcfc8', 400: '#a8a8a0', 500: '#8f8f87', 600: '#56564f', 700: '#3d3d38', 800: '#1c1c19', 900: '#0e0e0d', 950: '#070706' },
        content: { background: '#fbfbf9', borderColor: '#e4e4de' },
        text: { color: '#0e0e0d', mutedColor: '#8f8f87' },
        focusRing: { color: '#0e0e0d' },
      },
      dark: {
        primary: { color: '#f1f1f2', contrastColor: '#040406', hoverColor: '#d1d1d6', activeColor: '#f1f1f2' },
        surface: { 0: '#040406', 50: '#08080a', 100: '#0d0d11', 200: '#1b1b21', 300: '#303037', 400: '#57575f', 500: '#707078', 600: '#a9a9b0', 700: '#c2c2c7', 800: '#e3e3e6', 900: '#f1f1f2', 950: '#f8f8f9' },
        content: { background: '#040406', borderColor: '#1b1b21' },
        text: { color: '#f1f1f2', mutedColor: '#707078' },
        focusRing: { color: '#f1f1f2' },
      },
    },
  },
})
