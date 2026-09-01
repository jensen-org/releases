import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import Card from 'primevue/card'
import Button from 'primevue/button'
import App from './App.vue'
import './style.css'
const preset = definePreset(Aura, {
  primitive: { paper: '#FFFFFF', ink: '#111111', graphite: '#4A4A47', mist: '#E8E8E4', focus: '#70706B' },
  semantic: { primary: { 500: '{ink}' }, focusRing: { width: '2px', style: 'solid', color: '{focus}', offset: '3px' } },
})
createApp(App).use(PrimeVue, { ripple: false, theme: { preset, options: { darkModeSelector: false } } }).component('Card', Card).component('Button', Button).mount('#app')
