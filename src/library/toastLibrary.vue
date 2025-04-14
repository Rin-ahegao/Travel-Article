
<script setup lang="ts">
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const showToastWarning = (message: string) => {
  toast.warning(message, {
    autoClose: 3000,
    position: toast.POSITION.TOP_RIGHT,

  })
}
const showToastSuccess = (message: string) => {
  toast.success(message, {
    autoClose: 3000,
    position: toast.POSITION.TOP_RIGHT,
  })
}
const showToastError = (message: string) => {
  toast.success(message, {
    autoClose: 3000,
    position: toast.POSITION.TOP_RIGHT,
  })
}

defineExpose({
  showToastWarning,
  showToastSuccess,
  showToastError,
})
</script>

<template></template>
