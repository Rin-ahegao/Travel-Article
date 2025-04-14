import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    async login (identifier, password) {
      try {
        const response = await axios.post('/auth/local', { identifier, password })
        if (response.status === 200) {
          this.isAuthenticated = true
          const responseData = response.data
          const dataUser = {
            email: responseData.user.email,
            uname: responseData.user.username,
          }
          console.log(dataUser)
          Cookies.set('oreo', response.data.jwt)
          Cookies.set('userData', JSON.stringify(dataUser))
          this.user = { responseData }
          return true
        }
        return false
      } catch (error) {
        console.error('Login error:', error.message)
        return false
      }
    },
    async register (username, email, password) {
      try {
        const response = await axios.post('/auth/local/register', { username, email, password })
        if (response.status === 200) {
          this.isAuthenticated = true
          const responseData = response.data
          this.data = { responseData }
          return true
        }
        return false
      } catch (error) {
        console.error('Login error:', error.message)
        return { success: false, message: error.message }
      }
    },
    logout () {
      Cookies.remove('userData')
      Cookies.remove('oreo')
      this.isAuthenticated = false
      this.user = null
    },
  },
})
