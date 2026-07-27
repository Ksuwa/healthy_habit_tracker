import { ref } from 'vue'

const isVisible = ref(false)

export function useModal() {
  function open() { isVisible.value = true }
  function close() { isVisible.value = false }

  return { isVisible, open, close }
}
