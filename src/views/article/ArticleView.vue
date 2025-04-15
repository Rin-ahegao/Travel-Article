<template>
  <v-card class="mx-auto" color="grey-lighten-3">
    <v-layout row wrap>
      <v-app-bar color="teal-darken-4" image="https://picsum.photos/1920/1080?random">
        <template #image>
          <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)" />
        </template>
        <v-menu transition="scale-transition">
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-app-bar-nav-icon />
            </v-btn>
          </template>
          <v-list>
            <v-list-item class="cursor-pointer">
              <v-list-item-title @click="logoutAction">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-app-bar-title>Travel Article</v-app-bar-title>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon @click="openDialog('')">
          <v-icon>mdi-plus </v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <header
          class="py-12 bg-cover bg-center relative"
          style="background-image: url('https://picsum.photos/1920/1080?random');"
        >
          <div class="container mx-auto px-4 text-center relative z-10 text-white">
            <h1 class="text-3xl font-bold">
              The Article: Collection of articles in the library
            </h1>
            <p class="mt-4">
              look for interesting and useful articles for you to read
            </p>
            <div class="mt-6 flex justify-center">
              <div class="relative w-full max-w-md">
                <v-icon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                >
                  mdi-magnify
                </v-icon>
                <input
                  id="search"
                  class="w-full pl-10 pr-4 bg-white py-2 border rounded-lg focus:outline-none transition-all border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Search . . ."
                  type="text"
                >
              </div>
            </div>
          </div>
        </header>
        <v-container fluid>
          <div class="justify-self-end">
            <v-pagination
              v-model:current-page="currentPage"
              :length="pageCount"
              rounded="circle"
              size="small"
              :total-visible="4"
            />
          </div>
          <v-row>
            <v-col
              v-for="(item, index) in items"
              :key="index"
              :cols="12"
              :lg="4"
              :md="4"
              :sm="12"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <article class="bg-white p-6 rounded-lg shadow-md">
                  <img
                    alt="Two people working together in an office setting"
                    class="w-full h-48 object-cover rounded-t-lg"
                    :src="item.cover_image_url"
                  >
                  <div class="mt-4">
                    <p class="text-gray-600">
                      Publisher • {{ formatDate(item.publishedAt) }}
                    </p>
                    <h2 class="text-xl font-bold mt-2">
                      {{ item.title }}
                    </h2>
                    <p class="mt-2 text-gray-700">
                      {{ `${item.description.toString().substring(0, 200)} . . .` }}
                    </p>
                    <div class="mt-4 flex space-x-2 justify-space-between">
                      <span class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                        Design
                      </span>
                      <span class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer" @click="openDialog(item)">
                        <v-icon>mdi-pencil </v-icon>
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
  <Dialog :model-value="showDialog" :received-value="dialogValue" @reload="items" @update:model-value="showDialog = $event" />
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'
  import { useArticleStore } from '@/stores/article'
  import { computed, onMounted, ref, watch } from 'vue'
  import Dialog from './component/dialog.vue'
  const authStore = useAuthStore()
  const articleStore = useArticleStore()
  const router = useRouter()
  const items = computed(() => articleStore.articles)
  const currentPage = ref(1)
  const pageSize = 9
  const pageCount = computed(() => articleStore.pageCount)
  const dialogValue = ref('')
  const showDialog = ref(false)
  const openDialog = value => {
    dialogValue.value = value
    showDialog.value = true
  }
  async function logoutAction () {
    authStore.logout()
    router.push('/login')
  }
  function formatDate (dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/ /g, ' ')
  }
  onMounted(() => {
    articleStore.fetchArticles(currentPage.value, pageSize)
  })
  watch(currentPage, newPage => {
    console.log('Current Page:', currentPage)
    articleStore.fetchArticles(newPage, pageSize)
  })
</script>
