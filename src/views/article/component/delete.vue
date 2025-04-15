<template>
  <div class="text-center pa-4">
    <v-dialog v-model="internalDialog" max-width="1000" persistent>
      <v-card>
        <v-card-title>
          <div class="flex justify-space-between">
            Delete Data
            <v-icon class="cursor-pointer" color="red" @click="closeDialog">mdi-close</v-icon>
          </div>
        </v-card-title>
        <hr>
        <v-card-text>
          <h5 class="text-center">
            Are you sure delete it?
          </h5>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue" text @click="submitDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <ToastLibrary ref="toast" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useArticleStore } from '@/stores/article'
  import ToastLibrary from '@/library/toastLibrary.vue'

  export default defineComponent({
    components: {
      ToastLibrary,
    },
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
      receivedValue: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        internalDialog: this.modelValue,
        documentId: this.receivedValue,
      }
    },
    watch: {
      modelValue (val) {
        this.internalDialog = val
      },
      internalDialog (val) {
        this.$emit('update:modelValue', val)
      },
      receivedValue (val) {
        this.documentId = val
      },
    },
    methods: {
      closeDialog () {
        this.internalDialog = false
      },
      async submitDelete () {
        const articleStore = useArticleStore()
        const result = await articleStore.deleteArticles(this.documentId)
        if (result) {
          await articleStore.fetchArticles()
          this.$refs.toast.showToastSuccess('Data Deleted')
          this.closeDialog()
        } else {
          this.$refs.toast.showToastWarning('Failed to delete')
        }
      },
    },
  })
</script>
