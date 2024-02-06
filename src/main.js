import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/main.css'
import App from './App.vue'
import initializeRouter from './router'

const pinia = createPinia()
const app = createApp(App).use(pinia)

initializeRouter(app)

app.mount('#app')
