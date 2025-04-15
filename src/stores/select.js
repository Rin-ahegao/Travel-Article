import { defineStore } from 'pinia'
import axios from 'axios'

export const useSelectCategory = defineStore('category', {
  state: () => ({
    categoryList: [],
  }),
  actions: {
    async fetchCategory () {
      try {
        const response = await axios.get('/categories')
        if (response.status === 200) {
          this.categoryList = response.data.data
          return true
        }
        return false
      } catch (error) {
        console.error('Fetch categories error:', error.message)
        return false
      }
    },
  },
})
