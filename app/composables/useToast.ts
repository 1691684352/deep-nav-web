import { useUiStore } from '~/stores/ui'

export function useToast() {
  const ui = useUiStore()
  return {
    success: (message: string) => ui.toast(message, 'success'),
    error: (message: string) => ui.toast(message, 'error'),
    info: (message: string) => ui.toast(message, 'info'),
  }
}
