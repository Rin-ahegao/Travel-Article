<template>
  <div class="text-center pa-4">
    <v-dialog v-model="internalDialog" max-width="1000" persistent>
      <v-card>
        <v-card-title>
          <div class="flex justify-space-between">
            {{ receivedValue ? 'Edit Data' : 'Tambah Data' }}
            <v-icon class="cursor-pointer" color="red" @click="closeDialog">mdi-close</v-icon>
          </div>
        </v-card-title>
        <hr>
        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-card-text>
            <v-row>
              <v-col cols="12" :md="6" :sm="12">
                <div>
                  <label class="block text-gray-700 mb-1" for="title">Title</label>
                  <input id="title" class="w-full px-4 py-2 border rounded-lg focus:outline transition-all "
                    placeholder="Enter your title" type="text" v-model="form.titles">
                </div>
              </v-col>
              <v-col cols="12" :md="6" :sm="12">
                <div>
                  <label class="block text-gray-700 mb-1" for="email">Categori</label>
                  <select v-model="form.kategori" id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 liht:bg-gray-700 liht:border-gray-600 liht:placeholder-gray-400 liht:text-white liht:focus:ring-blue-500 liht:focus:border-blue-500">
                    <option disabled>Pilih kategori</option>
                    <option v-for="item in categoryStore.categoryList" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </option>
                  </select>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div>
                  <label class="block text-gray-700 mb-1" for="title">Description</label>
                  <textarea id="message"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your thoughts here..." rows="4" v-model="form.deskripsi" />
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div>
                  <label class="block text-gray-700 mb-1" for="title">Images</label>
                  <input id="title" class="w-full px-4 py-2 border rounded-lg focus:outline transition-all "
                    placeholder="Enter your title" type="file" @change="handleFileChange">
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="closeDialog">Batal</v-btn>
            <v-btn color="green" text @click="submitForm">Simpan</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
  <ToastLibrary ref="toast" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSelectCategory } from '@/stores/select'
import { useArticleStore } from '@/stores/article'
import ToastLibrary from '@/library/toastLibrary.vue'

export default defineComponent({
  components: {
    ToastLibrary,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    receivedValue: {
      type: [String, Object],
      default: ''
    }
  },
  emits: ['update:modelValue', 'reload'],
  data() {
    return {
      internalDialog: this.modelValue,
      isValid: false,
      form: {
        titles: '',
        deskripsi: '',
        kategori: '',
        coverImage: null as string | null
      },
      categoryStore: useSelectCategory(),
      articleStore: useArticleStore(),
    }
  },
  watch: {
    modelValue(val: boolean) {
      this.internalDialog = val
    },
    internalDialog(val: boolean) {
      this.$emit('update:modelValue', val)
    },
    receivedValue: {
      immediate: true,
      handler(newVal) {
        if (typeof newVal === 'object' && newVal !== null) {
          this.form.titles = newVal.title || ''
          this.form.deskripsi = newVal.description || ''
          this.form.kategori = newVal.category || ''
          this.form.coverImage = newVal.cover_image_url || ''
        } else {
          this.form.titles = ''
          this.form.deskripsi = ''
          this.form.kategori = ''
          this.form.coverImage = ''
        }
      }
    }
  },
  mounted() {
    this.categoryStore.fetchCategory()
  },
  methods: {
    closeDialog() {
      this.internalDialog = false
    },
    async handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (file && file.type.startsWith('image/')) {
        const base64 = await this.convertToBase64(file)
        this.form.coverImage = base64
      } else {
        alert('File harus berupa gambar (jpg, jpeg, png)')
        this.form.coverImage = ''
      }
    },
    convertToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
      })
    },
    async submitForm() {
      if (!this.form.titles || !this.form.deskripsi || !this.form.kategori) {
        this.$refs.toast.showToastWarning('Semua field wajib diisi!')
        return
      }
      const payload = {
        data: {
          title: this.form.titles,
          description: this.form.deskripsi,
          category: this.form.kategori,
          cover_image_url: this.form.coverImage,
        }
      }
      let result = false
      if (typeof this.receivedValue === 'object' && this.receivedValue?.id) {
        result = await this.articleStore.updateArticles(payload, this.receivedValue.documentId)
        if (result) {
          await this.articleStore.fetchArticles()
        }
      } else {
        result = await this.articleStore.insertArticles(payload)
        if (result) {
          await this.articleStore.fetchArticles()
        }
      }
      if (result) {
        this.$emit('reload')
        this.closeDialog()
        this.$refs.toast.showToastSuccess('Successfully Saved 👌')
      } else {
        this.$refs.toast.showToastWarning('Failed to save')
      }
    }
  }
})
</script>
