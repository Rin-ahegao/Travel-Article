import { defineStore } from 'pinia'
import axios from 'axios'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    pageCount: 0,
    totalItems: 0,
  }),
  actions: {
    async fetchArticles (page, size) {
      try {
        const response = await axios.get('/articles', {
          params: {
            'pagination[page]': page,
            'pagination[pageSize]': size,
          },
        })
        if (response.status === 200) {
          const responseData = response.data.data
          const pagination = response.data.meta.pagination
          this.articles = responseData
          this.pageCount = pagination.pageCount
          this.totalItems = pagination.total
          return true
        }
        return false
      } catch (error) {
        console.error('Fetch articles error:', error.message)
        return false
      }
    },
    async insertArticles (data) {
      try {
        const response = await axios.post('/articles', data )
        if (response.status === 200 || response.status === 201) {
          const responseData = response.data.data
          console.log(responseData)
          return true
        }
        return false
      } catch (error) {
        console.error('Fetch articles error:', error.message)
        return false
      }
    },
    async updateArticles (data, id) {
      try {
        const response = await axios.put('/articles', { params: { id } }, data )
        if (response.status === 200 || response.status === 201) {
          const responseData = response.data.data
          console.log(responseData)
          return true
        }
        return false
      } catch (error) {
        console.error('Fetch articles error:', error.message)
        return false
      }
    },
  },
})
