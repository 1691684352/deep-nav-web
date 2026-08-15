import { defineStore } from 'pinia'
import { toast as sonnerToast } from 'vue-sonner'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<ToastItem[]>([])
  const loginOpen = ref(false)
  const searchOpen = ref(false)
  const wechatOpen = ref(false)
  const drawerOpen = ref(false)

  function toast(message: string, tone: ToastTone = 'success', duration = 2600) {
    if (import.meta.client) {
      sonnerToast[tone](message, { duration })
    }
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(item => item.id !== id)
  }

  function openLogin() {
    loginOpen.value = true
  }

  function closeLogin() {
    loginOpen.value = false
  }

  function openSearch() {
    searchOpen.value = true
  }

  function closeSearch() {
    searchOpen.value = false
  }

  function toggleWechat(value?: boolean) {
    wechatOpen.value = value ?? !wechatOpen.value
  }

  function toggleDrawer(value?: boolean) {
    drawerOpen.value = value ?? !drawerOpen.value
  }

  function closeAll() {
    loginOpen.value = false
    searchOpen.value = false
    wechatOpen.value = false
    drawerOpen.value = false
  }

  return {
    toasts,
    loginOpen,
    searchOpen,
    wechatOpen,
    drawerOpen,
    toast,
    dismiss,
    openLogin,
    closeLogin,
    openSearch,
    closeSearch,
    toggleWechat,
    toggleDrawer,
    closeAll,
  }
})
