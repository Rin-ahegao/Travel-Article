<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col class="d-none d-md-flex" cols="12" md="6">
        <v-img contain src="../../assets/login-v2.svg" />
      </v-col>
      <v-col class="d-flex justify-center align-center px-10" cols="12" md="3">
        <div class="w-full max-w-md">
          <div class="flex justify-center mb-3 d-flex d-md-none">
            <img
              alt="User"
              class="shadow-md transition-transform duration-300 hover:scale-105"
              height="300"
              src="../../assets/login-v2.svg"
              width="300"
            >
          </div>
          <div class="">
            <h2 class="text-3xl font-bold text-center mb-2 text-gray-800">
              Sign In
            </h2>
            <p class="text-center text-gray-500 mb-6">
              Welcome back! Please enter your account
            </p>
            <form>
              <div class="mb-4">
                <label class="block text-gray-700 mb-1" for="email">Email</label>
                <input
                  id="email"
                  v-model="form.identifier"
                  :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none transition-all',
                  errors.identifier ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]"
                  placeholder="Enter your email"
                  type="email"
                >
              </div>
              <div class="mb-4 relative">
                <label class="block text-gray-700 mb-1" for="password">Password</label>
                <input
                  id="password"
                  v-model="form.password"
                  :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none transition-all',
                  errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]"
                  placeholder="Enter your password"
                  type="password"
                >
              </div>
              <div class="flex items-center justify-between mb-6">
                <label class="flex items-center">
                  <input class="form-checkbox text-blue-500" type="checkbox">
                  <span class="ml-2 text-gray-700">Remember for 30 Days</span>
                </label>
              </div>
              <div class="text-center">
                <v-btn
                  class="flex-grow-1 bg-blue"
                  height="35"
                  :loading="loading"
                  variant="tonal"
                  @click="login"
                >
                  Sign in
                </v-btn>
              </div>
            </form>
            <div class="flex items-center my-6">
              <hr class="flex-grow border-gray-300">
              <span class="mx-4 text-gray-500">OR</span>
              <hr class="flex-grow border-gray-300">
            </div>
            <p class="text-center text-gray-500 mt-6">
              Don’t have an account?
              <span class="text-blue hover:underline cursor-pointer" @click="router.push('/register')">Sign up</span>
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <ToasLibrary ref="toast" />
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import ToasLibrary from '@/library/toastLibrary.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  identifier: 'dummy@gmail.com',
  password: '1234',
})
const loading = ref(false)
const authStore = useAuthStore()
const { proxy }: any = getCurrentInstance()
const errors = ref({
  identifier: false,
  password: false,
})

async function login () {
  errors.value.identifier = !form.value.identifier
  errors.value.password = !form.value.password
  const hasError = errors.value.identifier || errors.value.password
  if (hasError) {
    proxy.$refs.toast?.showToastWarning?.('Please fill in all required fields!')
    return
  }
  loading.value = true
  const success = await authStore.login(form.value.identifier, form.value.password)
  if (success) {
    router.push('/article')
  } else {
    proxy.$refs.toast.showToastWarning('Login failed! Check email dan password.')
  }
  loading.value = false
}
</script>
<style scoped>
.fill-height {
  min-height: 10vh;
  background-image: url('../../assets/background.png');
  background-size: cover;
  background-position: center;
}
</style>
