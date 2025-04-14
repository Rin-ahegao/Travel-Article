<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col class="d-none d-md-flex" cols="12" md="6">
        <v-img contain src="../../assets/register-v2.svg" />
      </v-col>
      <v-col class="d-flex justify-center align-center px-10" cols="12" md="3">
        <div class="w-full max-w-md">
          <div class="flex justify-center mb-3 d-flex d-md-none">
            <img alt="User" class="shadow-md transition-transform duration-300 hover:scale-105" height="300"
              src="../../assets/register-v2.svg" width="300">
          </div>
          <div class="">
            <h2 class="text-3xl font-bold text-center mb-2 text-gray-800">
              Create an account
            </h2>
            <p class="text-center text-gray-500 mb-6">
              Enter your details below to create account and get started
            </p>
            <form>
              <div class="mb-4">
                <label class="block text-gray-700 mb-1" for="uname">Username</label>
                <input id="uname" v-model="form.username" :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none transition-all',
                  errors.username ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]" placeholder="Enter your username" type="text" />
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 mb-1" for="email">Email</label>
                <input id="email" v-model="form.email" :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none transition-all',
                  errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]" placeholder="Enter your email" type="email" />
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 mb-1" for="password">Password</label>
                <input id="password" v-model="form.password" :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none transition-all',
                  errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]" placeholder="Enter your password" type="password" />
              </div>
              <div class="d-flex justify-center">
                <div class="text-center me-5">
                  <v-btn block class="flex-grow-1 bg-grey" height="35" :disabled="loading" variant="tonal"
                    @click="router.push('/login')">
                    Cancel
                  </v-btn>
                </div>
                <div class="text-center">
                  <v-btn block class="flex-grow-1 bg-blue" height="35" :loading="loading" variant="tonal"
                    @click="register">
                    Create
                  </v-btn>
                </div>
              </div>
            </form>
            <div class="flex items-center my-6">
              <hr class="flex-grow border-gray-300">
              <span class="mx-4 text-gray-500">OR</span>
              <hr class="flex-grow border-gray-300">
            </div>
            <p class="text-center text-gray-500 mt-6">
              Already have an account?
              <span class="text-blue hover:underline cursor-pointer" @click="router.push('/login')">Sign in</span>
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <ToastLibrary ref="toast" />
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import ToastLibrary from '@/library/toastLibrary.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  username: '',
  email: '',
  password: '',
})
const errors = ref({
  username: false,
  email: false,
  password: false,
})
const loading = ref(false)
const authStore = useAuthStore()
const { proxy }: any = getCurrentInstance()

async function register() {
  errors.value.username = !form.value.username
  errors.value.email = !form.value.email
  errors.value.password = !form.value.password
  const hasError = errors.value.username || errors.value.email || errors.value.password
  if (hasError) {
    proxy.$refs.toast?.showToastWarning?.('Please fill in all required fields!')
    return
  }
  loading.value = true
  const result = await authStore.register(
    form.value.username,
    form.value.email,
    form.value.password
  )
  if (result) {
    proxy.$refs.toast.showToastSuccess('Successfully, your account has been successfully created 👌')
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } else {
    proxy.$refs.toast.showToastWarning(`Register failed!`)
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
