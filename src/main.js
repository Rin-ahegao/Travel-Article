import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import './assets/main.css'
import axios from 'axios'

axios.defaults.baseURL = process.env.VITE_APP_URL
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(vuetify)
app.mount('#app')
