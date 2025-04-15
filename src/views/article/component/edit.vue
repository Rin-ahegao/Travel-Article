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
                  <input id="title" v-model="form.titles"
                    class="w-full px-4 py-2 border rounded-lg focus:outline transition-all "
                    placeholder="Enter your title" type="text">
                </div>
              </v-col>
              <v-col cols="12" :md="6" :sm="12">
                <div>
                  <label class="block text-gray-700 mb-1" for="email">Categori</label>
                  <select id="countries" v-model="form.kategori"
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
                  <textarea id="message" v-model="form.deskripsi"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your thoughts here..." rows="4" />
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

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useArticleStore } from '@/stores/article'
import { useSelectCategory } from '@/stores/select'

const props = defineProps({
  modelValue: Boolean,
  receivedValue: Object
})

const emit = defineEmits(['update:modelValue', 'reload'])

const articleStore = useArticleStore()
const categoryStore = useSelectCategory()

const internalDialog = ref(false)
const isValid = ref(false)
const form = ref({
  id: null,
  titles: '',
  kategori: '',
  deskripsi: '',
  image: null
})

// Sync dengan prop modelValue
watch(() => props.modelValue, (val) => {
  internalDialog.value = val
})

// Emit perubahan ke parent
watch(internalDialog, (val) => {
  emit('update:modelValue', val)
})

// Masukkan receivedValue ke dalam form saat dialog terbuka
watch(() => props.receivedValue, (newVal) => {
  if (newVal) {
    form.value = {
      id: newVal.id,
      titles: newVal.titles,
      kategori: newVal.kategori,
      deskripsi: newVal.deskripsi,
      image: null // default null, hanya update jika user pilih file baru
    }
  } else {
    // reset form untuk tambah
    form.value = {
      id: null,
      titles: '',
      kategori: '',
      deskripsi: '',
      image: null
    }
  }
})

// Tutup dialog
const closeDialog = () => {
  internalDialog.value = false
}

// Handle perubahan file
const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    form.value.image = file
  }
}

// Submit form
const submitForm = async () => {
  const payload = {
    data: {
      id: form.value.id,
      title: form.value.titles,
      category: form.value.kategori,
      description: form.value.deskripsi,
      image: form.value.image
    }
  }

  try {
    if (form.value.id) {
      await articleStore.updateArticles(payload)
    }

    emit('reload') // reload data di parent
    internalDialog.value = false
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

</script>
