import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // ← Add this import
import './styles/main.css'

const app = createApp(App)

app.use(router)  // ← Add this line to install the router

app.mount('#app')