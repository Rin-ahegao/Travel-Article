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

<script setup lang="ts">
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import { defineEmits, defineProps } from 'vue'
import { useSelectCategory } from '@/stores/select'
import { useArticleStore } from '@/stores/article'
import ToastLibrary from '@/library/toastLibrary.vue'
const articleStore = useArticleStore()
const categoryStore = useSelectCategory()
const { proxy }: any = getCurrentInstance()
const emit = defineEmits(['update:modelValue', 'reload'])
const props = defineProps({
  modelValue: Boolean,
  receivedValue: [String, Object],
})

const internalDialog = ref(props.modelValue)
const isValid = ref(false)

const form = ref({
  titles: '',
  deskripsi: '',
  kategori: '',
  coverImage: null,
})
console.log(props.receivedValue);

onMounted(() => {
  categoryStore.fetchCategory()
})

watch(() => props.modelValue, val => {
  internalDialog.value = val
})

watch(internalDialog, val => {
  emit('update:modelValue', val)
})
watch(
  () => props.receivedValue,
  (newVal) => {

    if (typeof newVal === 'object' && newVal !== null) {
      // Ini Edit
      form.value.titles = newVal.title || ''
      form.value.deskripsi = newVal.description || ''
      form.value.kategori = newVal.category || ''
      form.value.coverImage = newVal.cover_image_url || ''
    } else {
      // Ini Tambah Baru
      form.value.titles = ''
      form.value.deskripsi = ''
      form.value.kategori = ''
      form.value.coverImage = ''
    }
  },
  { immediate: true }
)
const closeDialog = () => {
  internalDialog.value = false
}
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.type.startsWith('image/')) {
    const base64 = await convertToBase64(file)
    form.value.coverImage = base64
  } else {
    alert('File harus berupa gambar (jpg, jpeg, png)')
    form.value.coverImage = ''
  }
}
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
const submitForm = async () => {
  const payload = {
    data: {
      title: form.value.titles,
      description: form.value.deskripsi,
      category: form.value.kategori,
      cover_image_url: form.value.coverImage,
    }
  }

  let result = false

  if (typeof props.receivedValue === 'object' && props.receivedValue?.id) {
    // Edit
    result = await articleStore.updateArticles(payload, props.receivedValue.id)
  } else {
    // Tambah
    result = await articleStore.insertArticles(payload)
  }

  if (result) {
    emit('reload')
    closeDialog()
    proxy.$refs.toast.showToastSuccess('Successfully Saved 👌')
  } else {
    proxy.$refs.toast.showToastWarning('Failed to save')
  }
}

</script>
