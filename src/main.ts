import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import App from './App.vue'
import { trackDownloads } from './lib/analytics'
import './style.css'

createApp(App).mount('#app')
inject()
trackDownloads(document)
