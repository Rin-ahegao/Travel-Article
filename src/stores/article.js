import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
  }),
  actions: {
    async login (identifier, password) {
      try {
        const response = await axios.post('/articles', { identifier, password })
        if (response.status === 200) {
          const responseData = response.data
          console.log( responseData)
        }
        return false
      } catch (error) {
        console.error('Login error:', error.message)
        return false
      }
    },
  },
})
