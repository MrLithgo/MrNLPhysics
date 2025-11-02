import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import '@/styles/main.css'
import { createHead } from '@unhead/vue/client'

const head = createHead()
const app = createApp(App)

app.use(head)
app.use(router)

app.mount('#app')
