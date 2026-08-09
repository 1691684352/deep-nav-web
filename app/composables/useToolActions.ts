import type { Tool } from '#shared/types'
import { useAccountStore } from '~/stores/account'
import { useUiStore } from '~/stores/ui'

/**
 * Shared behaviour for every tool card: favouriting requires a session and
 * opening a tool always records browsing history.
 */
export function useToolActions() {
  const account = useAccountStore()
  const ui = useUiStore()
  const toast = useToast()

  function isFavorite(slug: string) {
    return account.isFavorite(slug)
  }

  async function toggleFavorite(tool: Tool) {
    if (!account.isLoggedIn) {
      ui.openLogin()
      toast.info('登录后即可收藏工具')
      return
    }
    try {
      const added = await account.toggleFavorite(tool)
      toast.success(added ? `已收藏 ${tool.name}` : `已取消收藏 ${tool.name}`)
    }
    catch (error) {
      toast.error(apiErrorMessage(error, '收藏操作失败'))
    }
  }

  async function visit(tool: Tool) {
    try {
      await account.recordHistory(tool)
    }
    catch {
    }
  }

  async function copyLink(tool: Tool) {
    const link = `${window.location.origin}/tool/${tool.slug}`
    try {
      await navigator.clipboard.writeText(link)
      toast.success('链接已复制到剪贴板')
    }
    catch {
      toast.error('复制失败，请手动复制地址栏链接')
    }
  }

  return { isFavorite, toggleFavorite, visit, copyLink }
}
