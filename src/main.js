import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import './assets/main.css'
import Cookies from 'js-cookie'
import axios from 'axios'

axios.defaults.baseURL = process.env.VITE_APP_URL
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true
const token = Cookies.get('oreo')
if (token) {
  const tokenAuthorization = `Bearer ${token}`.replace('"', '')
  axios.defaults.headers['Authorization'] = tokenAuthorization
}
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(vuetify)
app.mount('#app')
