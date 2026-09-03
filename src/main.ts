import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import Button from 'primevue/button'
import App from './App.vue'
import { preset } from './theme'
import './style.css'

createApp(App)
  .use(PrimeVue, { ripple: false, theme: { preset, options: { darkModeSelector: '[data-theme="dark"]' } } })
  .component('Card', Card)
  .component('Button', Button)
  .mount('#app')
