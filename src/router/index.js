import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import LoginView from '@/views/authentication/LoginView.vue'
import RegisterView from '@/views/authentication/RegisterView.vue'
import ArticleView from '@/views/article/ArticleView.vue'

const routes = [
  {
    path: '/',
    name: 'default',
    component: LoginView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/article',
    name: 'article',
    component: ArticleView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = Cookies.get('oreo')
  if (isAuthenticated) {
    if (to.path === '/login') {
      next('/article')
    } else {
      next()
    }
  } else {
    if (to.path === '/article') {
      next('/login')
    } else {
      next()
    }
  }
});
export default router
