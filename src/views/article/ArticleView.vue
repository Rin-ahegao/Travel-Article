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
        <v-btn icon @click="openDialog('')">
          <v-icon>mdi-plus </v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <header class="py-12 bg-cover bg-center relative"
          style="background-image: url('https://picsum.photos/1920/1080?random');">
          <div class="container mx-auto px-4 text-center relative z-10 text-white">
            <h1 class="text-3xl font-bold">
              The Article: Collection of articles in the library
            </h1>
            <p class="mt-4">
              look for interesting and useful articles for you to read
            </p>
            <div class="mt-6 flex justify-center">
              <div class="relative w-full max-w-md">
                <v-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300">
                  mdi-magnify
                </v-icon>
                <input id="search"
                  class="w-full pl-10 pr-4 bg-white py-2 border rounded-lg focus:outline-none transition-all border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Search . . ." type="text">
              </div>
            </div>
          </div>
        </header>
        <v-container fluid>
          <div class="justify-self-end">
            <v-pagination v-model:current-page="currentPage" :length="pageCount" rounded="circle" size="small"
              :total-visible="4" />
          </div>
          <v-row>
            <template v-if="loading">
              <v-col v-for="n in 6" :key="n" :cols="12" :lg="4" :md="4" :sm="12">
                <v-skeleton-loader type="card" class="pa-4" elevation="2">
                  <template #default>
                    <div class="bg-white rounded-lg overflow-hidden">
                      <v-skeleton-loader type="image" height="192px" class="rounded-t-lg" />
                      <div class="p-4">
                        <v-skeleton-loader type="text" width="40%" class="mb-2" />
                        <v-skeleton-loader type="text" width="80%" class="mb-1" />
                        <v-skeleton-loader type="text" width="90%" class="mb-1" />
                        <v-skeleton-loader type="text" width="60%" class="mb-4" />
                        <div class="flex justify-between">
                          <v-skeleton-loader type="chip" width="60px" height="32px" />
                          <div class="flex space-x-2">
                            <v-skeleton-loader type="avatar" width="32px" height="32px" />
                            <v-skeleton-loader type="avatar" width="32px" height="32px" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </v-skeleton-loader>
              </v-col>
            </template>
            <template v-else>
              <v-col v-for="(item, index) in items" :key="index" :cols="12" :lg="4" :md="4" :sm="12">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <article class="bg-white p-6 rounded-lg shadow-md">
                    <img alt="Two people working together in an office setting"
                      class="w-full h-48 object-cover rounded-t-lg" :src="item.cover_image_url">
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
                        <span class="text-blue-500 px-3 py-1 rounded-full text-sm cursor-pointer"
                          @click="openBottomSheet(item)">
                          Read more ...
                        </span>
                        <div class="flex">
                          <span class="text-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer"
                            @click="openDialog(item)">
                            <v-icon>mdi-pencil</v-icon>
                          </span>
                          <span class="text-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer"
                            @click="openDeleteDialog(item.documentId)">
                            <v-icon color="red">mdi-delete</v-icon>
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
  <v-bottom-sheet v-model="bottomSheet" inset>
    <v-card>
      <v-card-title class="text-h6 text-center"></v-card-title>
      <v-card-text>
        <div v-if="selectedItem">
          <p class="text-end">{{ formatDate(selectedItem.publishedAt) }}</p>
          <img alt="Two people working together in an office setting"
          class="w-full h-50 object-cover rounded-t-lg" :src="selectedItem.cover_image_url">
          <p class="text-h6 mt-1">{{ selectedItem.title }}</p>
          <p class="mt-1">{{ selectedItem.description }}</p>
        </div>
        <div v-else>
          <p>Data tidak tersedia.</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="bottomSheet = false">Tutup</v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
  <Dialog :model-value="showDialog" :received-value="dialogValue" @reload="items"
    @update:model-value="showDialog = $event" />
  <DialogDelete :model-value="showDeleteDialog" :received-value="dialogValueDelete"
    @update:model-value="showDeleteDialog = $event" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useArticleStore } from '@/stores/article'
import Dialog from './component/dialog.vue'
import DialogDelete from './component/delete.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    Dialog,
    DialogDelete
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 9,
      dialogValue: null,
      dialogValueDelete: '',
      showDialog: false,
      showDeleteDialog: false,
      bottomSheet: false,
      selectedItem: null,
    }
  },
  computed: {
    items() {
      return useArticleStore().articles
    },
    pageCount() {
      return useArticleStore().pageCount
    },
    loading() {
      return useArticleStore().loading
    }
  },
  methods: {
    openBottomSheet(item) {
      console.log("🚀 ~ openBottomSheet ~ item:", item)
      this.selectedItem = item
      this.bottomSheet = true
    },
    openDialog(value: any) {
      this.dialogValue = value
      this.showDialog = true
    },
    openDeleteDialog(value: any) {
      this.dialogValueDelete = value
      this.showDeleteDialog = true
    },
    logoutAction() {
      const authStore = useAuthStore()
      const router = useRouter()
      authStore.logout()
      router.push('/login')
    },
    formatDate(dateStr: string) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).replace(/ /g, ' ')
    },
    fetchArticles() {
      const articleStore = useArticleStore()
      articleStore.fetchArticles(this.currentPage, this.pageSize)
    }
  },
  watch: {
    currentPage(newPage) {
      const articleStore = useArticleStore()
      console.log('Current Page:', newPage)
      articleStore.fetchArticles(newPage, this.pageSize)
    }
  },
  mounted() {
    this.fetchArticles()
  }
})
</script>
