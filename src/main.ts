import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import App from './App.vue'
import { preset } from './theme'
import './style.css'

createApp(App)
  .use(PrimeVue, { ripple: false, theme: { preset, options: { darkModeSelector: false } } })
  .component('Card', Card)
  .component('DataTable', DataTable)
  .component('Column', Column)
  .component('Button', Button)
  .component('Tag', Tag)
  .component('Message', Message)
  .mount('#app')
